import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // Adjust the path to your Firebase config file

// Dynamic Colors for the chart
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
  const [categoryData, setCategoryData] = useState([]);

  // Fetch the product data from Firestore and compute category counts
  useEffect(() => {
    // Set up a Firestore listener for real-time updates
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      // Create a map to count products per category
      const categoryCount = {};

      snapshot.forEach((doc) => {
        const product = doc.data();
        categoryCount[product.category] =
          (categoryCount[product.category] || 0) + 1;
      });

      // Convert the categoryCount object into an array format suitable for the PieChart
      const chartData = Object.keys(categoryCount).map((category) => ({
        name: category,
        value: categoryCount[category],
      }));

      // Update the state with the computed data
      setCategoryData(chartData);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Category Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={categoryData}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;
