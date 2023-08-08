import requests

payload = {"question": "please introduce fastapi, thank you"}
# ret = requests.get("http://0.0.0.0:7861/local_doc_search_chat", json=payload)
# print(ret.url)
# # for i in ret:
# #     print(i)

for i in requests.post(url="http://0.0.0.0:7861/local_doc_search_stream_chat", json=payload, stream=True):
    print(i)
