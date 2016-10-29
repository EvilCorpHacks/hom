FROM python:3.5

WORKDIR /code

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . ./
RUN useradd -u 1000 -d /tmp app \
 && chmod -R o+rw ./
ENV \
  PYTHONPATH=/code/hom \
  DJANGO_SETTINGS_MODULE=hom.settings

USER app
CMD ["gunicorn", "-b", "0.0.0.0:8080", "--reload", "hom.wsgi"]
