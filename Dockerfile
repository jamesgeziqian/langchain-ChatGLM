FROM nvidia/cuda:11.4.3-cudnn8-devel-ubuntu20.04
LABEL MAINTAINER="ProductSearch"

COPY . /ProductSearch/

EXPOSE 8888

RUN mkdir /ProductSearch/localModel

WORKDIR /ProductSearch

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo "Asia/Shanghai" > /etc/timezone

RUN apt-get update -y && apt-get install software-properties-common wget libxml2 python3 python3-pip curl libgl1 libglib2.0-0 make cmake -y && apt-get clean

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && python3 get-pip.py 

RUN pip3 install -r requirements.txt -i https://pypi.mirrors.ustc.edu.cn/simple/ && rm -rf `pip3 cache dir`

CMD ["python3", "-u", "api.py"]
