import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [balanceMap, setBalanceMap] = useState({});

  // Fetch users based on filter
  useEffect(() => {
    axios.get("http://localhost:3000/user/bulk?filter=" + filter)
      .then(response => {
        setUsers(response.data.users);
      });
  }, [filter]);

  // Fetch all balances and map them by userId
  useEffect(() => {
    axios.get("http://localhost:3000/account/getallbalance", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
    .then(response => {
      const map = {};
      response.data.message.forEach(account => {
        map[account.userId] = account.balance;
      });
      setBalanceMap(map);
    })
    .catch(err => {
      console.error("Failed to fetch balance:", err);
    });
  }, []);

  return (
    <div>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div>
        {users.map(user => (
          <User user={user} balance={balanceMap[user._id]} key={user._id} />
        ))}
      </div>
    </div>
  );
};

function User({ user, balance }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-4 px-2">
      <div className="flex items-center">
        <div className="rounded-full h-12 w-12 bg-slate-400 flex justify-center items-center mr-3 text-xl font-semibold text-white">
          {user.firstName[0]}
        </div>
        <div>
          <div className="font-medium">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-sm text-gray-600">
            ₹{balance !== undefined ? balance.toFixed(2) : "N/A"}
          </div>
        </div>
      </div>
      <div>
        <Button
          onClick={() => navigate(`/sendmoney?id=${user._id}&name=${user.firstName}`)}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
