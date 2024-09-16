import argparse
import json
import xml.etree.ElementTree as ET
from collections import defaultdict

import requests
from bs4 import BeautifulSoup


"""
This script is no longer required or in use
but will remain in the project for archiving and referencing if needed.
"""

if __name__ == '__main__':
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("--test_questions", type=str, help="Path to newline separated questions stored in txt file")
    arg_parser.add_argument("--output", type=str, help="Path to json output file")
    args = arg_parser.parse_args()

    # with open(args.test_questions, 'r', encoding='utf-8') as f:
    #     questions = [line.strip() for line in f]
    question = args.test_questions

    url = "https://va.ecitizen.gov.sg/flexAnsWS/ifaqservice.asmx/AskWSLanguage"
    partial_payload = {"ProjectId": 7536554, "RecordQuestion": "yes", "SessionId": 0, "TextLanguage": "en"}
    results = defaultdict(list)
    # for question in questions:
    # send API request to get answers
    payload = partial_payload.copy()
    payload.update({"Question": question})
    xml_string = requests.post(url, data=payload).text

    # print(xml_string)
    # parse xml string
    root = ET.fromstring(xml_string)
    count = int(root.find("Count").text)

    # parse html string
    raw_answers = [e.find("{urn:agathos-com:agathos-solutions:flexanswer:data:v1}Text").text for e in root.find("Responses").findall("Response")]

    if len(raw_answers) == 0:
        print("I am sorry, your question does not provide enough detail for me to answer. Please rephrase your question.")
    else:
        raw_answer = raw_answers[0]
        answer = BeautifulSoup(raw_answer, features='html.parser').text
        print(answer)
        results[question].append(answer)

    # assert len(results) == len(questions)
    # with open(args.output, 'w', encoding='utf-8') as f:
    #     json.dump(results, f)
