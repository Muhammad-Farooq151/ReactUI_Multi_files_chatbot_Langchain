from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
import io
import pandas as pd
from docx import Document
import openpyxl

from langchain_community.chat_models import ChatOpenAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain.text_splitter import RecursiveCharacterTextSplitter

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
load_dotenv()

openai_api_key = os.getenv('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')

# Ensure OpenAI API Key is loaded
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable not set")

def setup_qa_chain(uploaded_files):
    # Load documents
    docs = []
    for file in uploaded_files:
        file_stream = io.BytesIO(file.read())
        loader = PyPDFLoader(file_stream)
        docs.extend(loader.load())

    # Split documents
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=200
    )
    splits = text_splitter.split_documents(docs)

    # Create embeddings and store in vectordb
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectordb = DocArrayInMemorySearch.from_documents(splits, embeddings)

    # Define retriever
    retriever = vectordb.as_retriever(
        search_type='mmr',
        search_kwargs={'k': 2, 'fetch_k': 4}
    )

    # Setup memory for contextual conversation
    memory = ConversationBufferMemory(
        memory_key='chat_history',
        return_messages=True
    )

    # Setup LLM and QA chain
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, streaming=True)
    qa_chain = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, memory=memory, verbose=True)
    return qa_chain

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    filename = secure_filename(file.filename)

    processed_text = process_file(file, filename)
    if processed_text is None:
        return jsonify({"error": "Unsupported file type"}), 400

    return jsonify({"message": "File processed successfully"})

def process_file(file, filename):
    file_extension = filename.rsplit('.', 1)[1].lower()
    if file_extension == 'pdf':
        return process_pdf(file.stream)
    elif file_extension == 'csv':
        return process_csv(file)
    elif file_extension == 'docx':
        return process_docx(file)
    elif file_extension == 'xlsx':
        return process_xlsx(file)
    else:
        return None

def process_pdf(file_stream):
    reader = PdfReader(file_stream)
    text = ' '.join(page.extract_text() for page in reader.pages if page.extract_text())
    qa_chain = setup_qa_chain([file_stream])  # Setup QA chain with the uploaded PDF
    return text

def process_csv(file):
    df = pd.read_csv(file)
    text = ' '.join(df.astype(str).values.flatten())
    return text

def process_docx(file):
    doc = Document(file)
    text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
    return text

def process_xlsx(file):
    wb = openpyxl.load_workbook(file)
    sheet = wb.active
    text = '\n'.join([' '.join([str(cell.value) for cell in row]) for row in sheet.rows])
    return text

if __name__ == '__main__':
    app.run(debug=True)
