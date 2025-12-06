export default function Leaderboard({ data }) {
  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  const getRankBgColor = (rank) => {
    if (rank === 1) return "bg-amber-100";
    if (rank === 2) return "bg-slate-100";
    if (rank === 3) return "bg-orange-100";
    return "bg-white";
  };

  const getRankBgDarkColor = (rank) => {
    if (rank === 1) return "bg-amber-200";
    if (rank === 2) return "bg-slate-200";
    if (rank === 3) return "bg-orange-200";
    return "bg-gray-50";
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No affiliates yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#8B3A3A] text-white">
            <th className="px-6 py-4 text-left font-bold text-lg">RANK</th>
            <th className="px-6 py-4 text-left font-bold text-lg">AFFILIATE NAME</th>
            <th className="px-6 py-4 text-left font-bold text-lg">ORDERS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((affiliate, index) => {
            const rank = index + 1;
            const medal = getMedalIcon(rank);
            const bgColor = getRankBgColor(rank);
            const bgDarkColor = getRankBgDarkColor(rank);

            return (
              <tr
                key={affiliate._id || affiliate.id}
                className={`border-b border-gray-200 hover:${bgDarkColor} transition-colors`}
              >
                <td className={`px-6 py-4 font-bold text-gray-800 ${bgColor}`}>
                  <div className="flex items-center gap-3">
                    {medal && <span className="text-2xl">{medal}</span>}
                    <span className="text-lg">{rank}</span>
                  </div>
                </td>
                <td className={`px-6 py-4 font-semibold text-gray-800 ${bgColor}`}>
                  {affiliate.first_name} {affiliate.last_name}
                </td>
                <td className={`px-6 py-4 font-bold text-gray-800 ${bgColor}`}>
                  {affiliate.numberOfOrders}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
