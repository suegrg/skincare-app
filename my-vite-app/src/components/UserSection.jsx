const UserSection = ({ username, onLogout }) => {
  return (
    <section className="mt-8 w-full max-w-3xl text-center">
      <div className="mb-4">Welcome, {username}!</div>
      <button
        onClick={onLogout}
        className="bg-teal-500 text-black px-4 py-2 rounded-lg"
      >
        Log Out
      </button>
    </section>
  );
};

export default UserSection;
