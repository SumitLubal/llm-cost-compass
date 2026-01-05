export function SubmitButton() {
  return (
    <a
      href="/submit"
      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-md hover:shadow-lg"
    >
      <span>📤</span>
      Submit New Pricing
    </a>
  );
}