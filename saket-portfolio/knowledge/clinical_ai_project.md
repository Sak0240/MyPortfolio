# Clinical Document Intelligence and Structured Extraction

## Project Overview
This project focuses on extracting structured information from clinical documents and verifying extracted values against their original sources. Clinical records can contain printed text, scanned pages, handwriting, tables, and multilingual content. Manually reviewing and transferring this information into structured systems can be time-consuming.

The application aims to automate parts of this process while retaining validation and human review for uncertain results.

## Technologies
- Python, FastAPI, Pydantic
- Amazon Textract, Amazon S3, Amazon SQS
- PyMuPDF, Amazon Bedrock, PostgreSQL
- Docker, AWS

Only list services as implemented if they are actually integrated into the project.

## Proposed Processing Workflow
### 1. Document Upload
The user uploads a clinical document. The backend validates the file and stores it in the configured storage location.

### 2. PDF Processing
PyMuPDF can extract text from PDFs that already contain a text layer and help inspect or split documents into pages. Scanned PDFs may require OCR because their pages contain images rather than directly extractable text.

### 3. OCR
Amazon Textract can extract text and supported document elements from scanned documents and images. The application can use the OCR response to obtain text and associated confidence information. OCR confidence does not prove that recognized text is medically correct.

### 4. Extraction
An LLM can transform extracted text into a predefined structured format, such as test name, reported value, unit, date, and source page. The model should not fill missing values with assumptions.

### 5. Structured Validation
Pydantic can validate whether generated output follows the expected schema and data types. Additional rules can check date formats, allowed values, missing fields, and inconsistent records. Passing schema validation does not prove factual correctness.

### 6. Grounding and Evidence Verification
The application checks extracted values against source text and page references. Page and bounding-box information, where available, can help reviewers locate original content. A value should not be marked verified merely because the LLM returned valid JSON.

### 7. Human Review
Records with missing evidence, low OCR confidence, ambiguous handwriting, or conflicting values should be sent for review.

### 8. Storage and API Response
Validated information can be stored in the configured database and returned through FastAPI. Access controls should protect sensitive clinical information.

## Why Amazon Textract?
Amazon Textract is a document-analysis service that extracts text and supported structural information from documents. It is useful for OCR workflows involving scanned documents, forms, and tables. Capabilities and quality depend on document type, language, handwriting, layout, and selected API.

## Why PyMuPDF?
PyMuPDF can extract existing PDF text, inspect page content, render pages, and support document splitting. It is useful before OCR because not every PDF requires text recognition.

## Why Pydantic?
Pydantic validates application data against defined models and types. It helps ensure extracted output follows the application's expected structure.

## Why Use an LLM?
An LLM can interpret context and map extracted text into a predefined schema. Output must be checked because the model may omit information, misinterpret ambiguous text, or generate unsupported values.

## Why Is Grounding Important?
Grounding connects an extracted value or generated answer to evidence in the source document. This helps reviewers verify the correct value, date, unit, or test name.

## Why Is Human Review Necessary?
Some records are ambiguous or difficult to read. Human review handles uncertainty instead of automatically accepting potentially incorrect data.

## Safety Considerations
- Do not invent missing clinical values.
- Preserve units and dates from the source.
- Flag conflicting values for review.
- Separate schema validity from factual correctness.
- Restrict access to sensitive documents.
- Minimize personal information sent to external models.
- Use appropriate encryption and access controls.
- Do not treat extracted data as a medical diagnosis.
- Retain source references so reviewers can verify output.

## Interview Questions
**What is the difference between PDF text extraction and OCR?**  
PDF text extraction reads text already embedded in the PDF. OCR recognizes text from page images, such as scanned documents.

**Why use Textract instead of a basic OCR library?**  
Textract is a managed document-analysis service with support for extracting text and certain structural elements. The choice depends on document quality, required features, cost, and language requirements.

**What does Pydantic validate?**  
It validates structure and types. Separate checks are needed to establish whether extracted values match the source.

**How do you handle unreadable handwriting?**  
Flag uncertain content for review rather than inventing a value.

**How do you prevent the LLM from inventing clinical values?**  
Use constrained extraction instructions, structured schemas, source evidence, deterministic validation, and human review for uncertain results.

**Does valid JSON mean the extraction is correct?**  
No. Valid JSON only shows that output follows the required structure. Extracted values must also be checked against the source.

**What is the difference between OCR confidence and extraction confidence?**  
OCR confidence relates to text recognition. Extraction confidence concerns how reliably a field was identified or interpreted. Neither alone proves correctness.

**How would you evaluate this system?**  
Compare extracted fields against manually verified reference data. Measure field-level precision and recall, exact-match accuracy where appropriate, schema validity, evidence support, and the proportion of fields requiring human review.
