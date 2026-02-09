
from rag.rag_pipeline import run_rag


def main():
    print("=" * 50)
    print("RAG-Evolab | Terminal Q&A")
    print("Type 'exit' or 'quit' to stop")
    print("=" * 50)

    while True:
        query = input("\nEnter your question: ").strip()

        if query.lower() in {"exit", "quit"}:
            print("Exiting RAG. Goodbye!")
            break

        if not query:
            print("Please enter a valid question.")
            continue

        print("\n--- Answer ---")
        answer = run_rag(query)
        print(answer)
        print("---------------")


if __name__ == "__main__":
    main()
