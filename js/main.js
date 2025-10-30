window.alert = () => {}; // Desactiva cualquier alerta que venga de otro archivo

document.addEventListener("DOMContentLoaded", () => {
  const earnBtn = document.getElementById("earnBtn");

  if (earnBtn) {
    earnBtn.addEventListener("click", () => {
      // Actualizar tokens y progreso
      let balance = parseInt(localStorage.getItem("balance") || "0") + 5;
      let progress = Math.min(100, (parseInt(localStorage.getItem("progress") || "0") + 10));
      localStorage.setItem("balance", balance);
      localStorage.setItem("progress", progress);
      document.getElementById("balance").innerText = `${balance} tokens`;

      // Crear modal con el mismo diseño que “Ver info”
      const modal = document.createElement("div");
      modal.id = "rewardModal";
      modal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content">
            <h2>🎉 ¡Reto completado!</h2>
            <p>Has ganado <strong>5 tokens</strong>.</p>
            <p>Tu nuevo saldo es <strong>${balance}</strong> tokens.</p>
            <button id="closeReward" class="btn-primary">Cerrar</button>
          </div>
        </div>
      `;

      // Estilos del modal (idénticos al de “Ver info”)
      const style = document.createElement("style");
      style.innerHTML = `
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
          z-index: 1000;
        }

        .modal-content {
          background: #fff;
          padding: 24px 28px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          text-align: center;
          animation: scaleIn 0.3s ease;
          max-width: 380px;
          width: 90%;
        }

        .modal-content h2 {
          margin-bottom: 12px;
          color: #333;
        }

        .modal-content p {
          margin: 6px 0;
          color: #555;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s ease;
          margin-top: 14px;
        }

        .btn-primary:hover {
          background-color: #0056b3;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `;

      // Insertar modal y estilos
      document.head.appendChild(style);
      document.body.appendChild(modal);

      // Botón para cerrar modal
      document.getElementById("closeReward").addEventListener("click", () => {
        document.querySelector(".modal-overlay").remove();
      });
    });
  }
});