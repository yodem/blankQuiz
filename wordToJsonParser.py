import json
from docx import Document


def parse_word_document(doc_path):
    document = Document(doc_path)
    questions_list = []

    current_question = {}
    choices = {}
    correct_answer = ""
    in_choices = False

    def is_choice(text):
        return (text.startswith("א-") or text.startswith("ב-") or text.startswith("ג-") or
                text.startswith("ד-") or text.startswith("ה-") or text.startswith("ו-") or
                text.startswith("א.") or text.startswith("ב.") or text.startswith("ג.") or
                text.startswith("ד.") or text.startswith("ה.") or text.startswith("ו."))

    for para in document.paragraphs:
        text = para.text.strip()

        if not text:
            continue

        if is_choice(text):
            in_choices = True
            label, choice = text.split("-", 1) if "-" == text[1] else text.split(".", 1)
            choice_text = choice.strip()
            is_marked = any(run.font.highlight_color for run in para.runs)
            if is_marked:
                correct_answer = label.strip()
            choices[label.strip()] = choice_text
        else:
            if in_choices and current_question:
                current_question["choices"] = choices
                current_question["correct_answer"] = correct_answer
                questions_list.append(current_question)
                current_question = {}
                choices = {}
                correct_answer = ""
                in_choices = False

            current_question["question"] = text

    if current_question and choices:
        current_question["choices"] = choices
        current_question["correct_answer"] = correct_answer
        questions_list.append(current_question)

    return questions_list


def convert_to_json(doc_path, json_file_path):
    questions_list = parse_word_document(doc_path)

    with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(questions_list, jsonfile, ensure_ascii=False, indent=4)


# Paths to your input Word document and output JSON file
doc_path = 'C:/Users/yotam/Desktop/questions.docx'
json_file_path = 'C:/Users/yotam/Desktop/questions.json'

convert_to_json(doc_path, json_file_path)
