import AppLink from "../common/AppLink.tsx";

function BoardGameList() {
  return (
    <div className="fixed w-full h-full bg-gray-900 text-emerald-100 flex justify-center items-center">
      <div className="bg-gray-800 w-full h-full sm:w-auto sm:h-auto sm:aspect-[5/1] sm:border sm:border-emerald-300 rounded p-12">
        <div className="grid grid-cols-1 gap-4">
          <div className="text-2xl text-center">Board Games</div>
          <AppLink to={`/codenames/${crypto.randomUUID()}`} text="Codenames" />
          <AppLink to={`/decrypto/${crypto.randomUUID()}`} text="Decrypto" />
        </div>
      </div>
    </div>
  );
}

export default BoardGameList;
