import { useState } from "react";
import { LoginButtonClass } from "./atoms/LoginButton";
import Modal from "../common/modal/Modal";
import LoginInput from "./atoms/LoginInput";
import { FiMail } from "react-icons/fi";
import InputEmail from "./molecules/InputEmail";

export default function ResetPasswordModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    console.log("Reset Password");
  };
  return (
    <Modal closeModal={closeModal}>
      <h2 className="text-xl font-semibold mb-4">Resetowanie hasła</h2>
      <p className="text-sm text-gray-700 mb-4">
        Wprowadź adres e-mail powiązany z Twoim kontem, aby zresetować hasło.
      </p>
      <InputEmail value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className={LoginButtonClass} onClick={handleResetPassword}>
        Resetuj hasło
      </button>
    </Modal>
  );
}
