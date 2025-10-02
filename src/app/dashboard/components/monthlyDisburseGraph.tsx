"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const MonthlyDisbursementChart = ({ dashData }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const monthlyDisbursements = dashData.monthly_disbursements || [];

    const months = monthlyDisbursements.map((d) => d.month);
    const amounts = monthlyDisbursements.map((d) => d.amount);
    const counts = monthlyDisbursements.map((d) => d.count);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Amount", "Count"],
      },
      xAxis: {
        type: "category",
        data: months,
      },
      yAxis: [
        {
          type: "value",
          name: "Amount",
        },
        {
          type: "value",
          name: "Count",
        },
      ],
      series: [
        {
          name: "Amount",
          data: amounts,
          type: "bar",
          itemStyle: { color: "#4f46e5" }, // indigo
        },
        {
          name: "Count",
          data: counts,
          type: "line",
          yAxisIndex: 1,
          itemStyle: { color: "#22c55e" }, // green
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [dashData.monthly_disbursements]);

  return (
    <div>
      <h2 className="text-base  my-4 dark:text-white">
        Monthly Disbursement Graph
      </h2>
      <div ref={chartRef} className="w-full h-[500px]" />
    </div>
  );
};

export default MonthlyDisbursementChart;
