import fitz
def clean_text(text):
    clean_text=text.replace('\n',' ')
    clean_text=clean_text.replace('\r',' ')
    clean_text=clean_text.replace('\t',' ')
    return clean_text
def load_pdf(file_path):
    documents=[]
    doc = fitz.open(file_path)
    for page_number in range(doc.page_count):
        page = doc.load_page(page_number)
        text=page.get_text()
        cleaned_text=clean_text(text)

        if cleaned_text.strip():  
            documents.append({
                "text": cleaned_text,
                "metadata": {"source": file_path, "page_number": page_number}
            })
    doc.close()
    return documents      









  