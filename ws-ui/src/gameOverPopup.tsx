// Add this new component to your file (or create a separate file for it)
export const GameOverPopup = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%)",
          padding: "2rem",
          borderRadius: "12px",
          width: "80%",
          maxWidth: "500px",
          color: "white",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            marginBottom: "1.5rem",
            fontWeight: "bold",
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          🎮 Game Over
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            padding: "0.8rem 1.5rem",
            background: "white",
            color: "#6e48aa",
            border: "none",
            borderRadius: "50px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
