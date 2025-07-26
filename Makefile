.PHONY: mongodb-start mongodb-stop mongodb-clean server client test

mongodb-start:
	docker network inspect mongo-network >/dev/null 2>&1 || docker network create mongo-network
	docker run -d --name mongodb \
		--network mongo-network \
		--restart unless-stopped \
		-e MONGODB_ROOT_USER=root \
		-e MONGODB_ROOT_PASSWORD=rootpassword \
		-e MONGODB_DATABASE=sweet_shop \
		-p 27017:27017 \
		bitnami/mongodb:latest

mongodb-stop:
	docker stop mongodb || true
	docker rm mongodb || true

mongodb-clean: mongodb-stop
	docker network rm mongo-network || true

server:
	cd server && poetry run uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

test:
	cd server && poetry run pytest

# Next.js app
client:
	cd client && npm run dev