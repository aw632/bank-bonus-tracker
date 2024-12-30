# Bank Bonus Tracker

A simple application to help track bank account signup bonuses, their requirements, and progress.

## Features

- Track multiple bank account bonuses
- Monitor deposit requirements and progress
- Track important dates and deadlines
- Dark/Light mode support
- Local storage persistence

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/aw632/bank-bonus-tracker.git
cd bank-bonus-tracker
```

2. Install dependencies using yarn:

```bash
yarn install
```

3. Set up your environment variables:

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your Cerebras API key
CEREBRAS_API_KEY=your-api-key-here
```

4. Start the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

The following environment variables are required:

- `CEREBRAS_API_KEY`: Your API key for the Cerebras Cloud SDK (used for bonus text parsing)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
