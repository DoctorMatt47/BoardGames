import pandas as pd
import numpy as np

from firebase_admin import credentials, firestore, initialize_app
from functools import reduce


def get_words_1():
    df = pd.read_excel('words_1.xls')
    return df['рус'].map(lambda x: x.lower()).values

def get_words_2():
    df = pd.read_excel('words_2.xls')
    return df['СЛОВО'].map(lambda x: x.lower()).values

def get_words_3():
    df = pd.read_excel('words_3.xls')
    return df['СЛОВО'].map(lambda x: x.lower()).values

def unique_union(*args):
    return np.unique(reduce(np.union1d, args))

def push_to_firestore(words):
    cred = credentials.Certificate("doctormatt-board-games-firebase-adminsdk-y3qxc-fa70921594.json")
    initialize_app(cred)
    db = firestore.client()
    
    collection_ref = db.collection('codename-words')

    for i in range(len(words)):
        doc_ref = collection_ref.document(str(i))

        doc_ref.set({
            "value": words[i]
        })

def main():
    words_1 = get_words_1()
    words_2 = get_words_2()
    words_3 = get_words_3()
    
    words = unique_union(words_1, words_2, words_3)
    push_to_firestore(words)
    
    print(words)
    
    
if __name__ == '__main__':
    main()
