## Project setup

1. Clone the repository:

```bash
$ git clone <repository-url>
$ cd thrift-store-backend
```

2. Add a `.env` file and configure the variables listed in `.env.example`.

3. Install dependencies:

```bash
$ yarn install
```

## Compile and run the project

1. For development:

```bash
$ yarn run start
```

2. For watch mode (auto-restart on changes):

```bash
$ yarn run start:dev
```

3. **Open the application**:
   Open [http://localhost:3001/api](http://localhost:3001/api) with your browser to access the api documentation.

## Additional steps(setup the database)

1. Run database migrations:

```bash
$ yarn run migration:run
```
