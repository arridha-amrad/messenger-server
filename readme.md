- require .env

# Creating keys for generating jwt token
openssl genrsa -out private.pem 1024 && openssl rsa -in private.pem -pubout -out public.pem