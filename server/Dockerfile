FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7
RUN apk --update add bash nano
RUN mkdir /usr/src/app/
COPY . /usr/src/app/
WORKDIR /usr/src/app/
COPY ./requirements.txt /var/www/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /var/www/requirements.txt
RUN pip install -U flask-cors
EXPOSE 5000
CMD ["python", "app.py"]