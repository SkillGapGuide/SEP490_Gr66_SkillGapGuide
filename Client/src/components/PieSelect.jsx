import React, { useState } from "react";

const statusPieOptions = [
  { value: "WANT_TO_LEARN", label: "Muốn học", color: "#60A5FA", angle: -90 },   // Top
  { value: "LEARNING", label: "Đang học", color: "#FBBF24", angle: 30 },         // Bottom right
  { value: "COMPLETED", label: "Đã hoàn thành", color: "#34D399", angle: 150 }   // Bottom left
];

export default function PieSelect({ value, onChange }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // getArc giống như cũ
  const getArc = (startAngle, endAngle) => {
    const r = 30;
    const x1 = 40 + r * Math.cos(Math.PI * startAngle / 180);
    const y1 = 40 + r * Math.sin(Math.PI * startAngle / 180);
    const x2 = 40 + r * Math.cos(Math.PI * endAngle / 180);
    const y2 = 40 + r * Math.sin(Math.PI * endAngle / 180);
    return `
      M 40 40
      L ${x1} ${y1}
      A ${r} ${r} 0 0 1 ${x2} ${y2}
      Z
    `;
  };

  // Xác định vị trí label quanh hình tròn
  const labelPositions = [
    { left: "50%", top: "-12px", transform: "translateX(-50%)", align: "center" },        // Top
    { left: "90%", top: "62%", transform: "translate(-70%,-45%)", align: "left" },        // Bottom right
    { left: "10%", top: "62%", transform: "translate(-10%,-45%)", align: "right" },       // Bottom left
  ];

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80">
        {statusPieOptions.map((opt, idx) => (
          <path
            key={opt.value}
            d={getArc(120 * idx - 90, 120 * (idx + 1) - 90)}
            fill={opt.color}
            opacity={value === opt.value || hoverIndex === idx ? 1 : 0.38}
            style={{
              cursor: "pointer",
              transition: "opacity 0.18s"
            }}
            onClick={() => onChange(opt.value)}
            onMouseEnter={() => setHoverIndex(idx)}
            onMouseLeave={() => setHoverIndex(null)}
          />
        ))}
        <circle cx="40" cy="40" r="16" fill="white" />
        <circle
          cx="40"
          cy="40"
          r="31"
          fill="none"
          stroke={statusPieOptions.find(opt => opt.value === value || hoverIndex !== null && hoverIndex === statusPieOptions.findIndex(opt2 => opt2.value === opt.value))?.color || "#ccc"}
          strokeWidth="2.5"
          opacity="0.7"
        />
      </svg>
      {/* Labels cho từng phần */}
      {statusPieOptions.map((opt, idx) => (
        <span
          key={opt.value}
          className="absolute px-2 py-0.5 rounded-full text-xs font-semibold pointer-events-none"
          style={{
            left: labelPositions[idx].left,
            top: labelPositions[idx].top,
            transform: labelPositions[idx].transform,
            background: hoverIndex === idx || value === opt.value ? opt.color : "#e5e7eb", // #e5e7eb = gray-200
            color: hoverIndex === idx || value === opt.value ? "#fff" : "#444",
            boxShadow: hoverIndex === idx || value === opt.value ? "0 2px 8px #0001" : "none",
            zIndex: 10,
            minWidth: 80,
            textAlign: labelPositions[idx].align,
            border: "1px solid #fff",
            transition: "all 0.15s"
          }}
        >
          {opt.label}
        </span>
      ))}
      {/* label trạng thái chính ở giữa */}
      <div className="absolute text-xs font-bold pointer-events-none text-center w-[70px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-900"
        style={{
          fontSize: "14px",
          textShadow: "0 2px 4px #fff8,0 1px 8px #0001"
        }}
      >
        {statusPieOptions.find(opt => opt.value === value)?.label}
      </div>
    </div>
  );
}
