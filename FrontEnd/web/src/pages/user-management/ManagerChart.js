import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const countRoles = (data) => {
  const roleCounts = {};

  data.forEach((user) => {
    const role = user.role;
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });

  return roleCounts;
};

const ManagerChart = () => {
  const [userData, setUserData] = useState([]);
  const roleCounts = countRoles(userData);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth");
        const data = await res.json();
        setUserData(data.users);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaff();
  }, []);

  const managerRoles = [
    "user",
    "admin",
    "event-manager",
    "inquiry-manager",
    "hotel-manager",
    "package-manager",
    "campingitem-manager",
    "feedback-manager",
    "vehicle-manager",
  ];
  const managerCounts = managerRoles.map((role) => roleCounts[role] || 0);

  const data = {
    labels: managerRoles,
    datasets: [
      {
        label: "Number of Member",
        data: managerCounts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Member Role Count",
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index) {
            // Split label into multiple lines if too long
            const label = this.getLabelForValue(index);
            return label.length > 10 ? label.split("-") : label; // Splits on dash if label is long
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Member Count",
        },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ManagerChart;
