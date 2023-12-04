"use client";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: "admin",
    password: "admin",
    role: "admin",
  });
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ username: "", password: "", role: "" });

      const res = await signIn("credentials", {
        redirect: false,
        username: formValues.username,
        password: formValues.password,
        role: formValues.role,
      });

      setLoading(false);

      console.log(res);
      if (!res?.error) {
        router.push("/");
      } else {
        setError("Identifiants invalides");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <p className="text-center text-sm bg-red-300 py-4 mb-6 rounded">
          {error}
        </p>
      )}
      <div className="mb-6">
        <TextField
          label="Nom d'utilisateur"
          required
          type="text"
          name="username"
          value={formValues.username}
          onChange={handleChange}
          placeholder="Nom d'utilisateur"
        />
      </div>
      <div className="mb-6">
        <TextField
          label="Mot de passe"
          required
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Mot de passe"
        />
      </div>
      <div className="mb-6">
        <FormControl fullWidth>
          <InputLabel>Sélectionnez le rôle</InputLabel>
          <Select
            required
            name="role"
            onChange={(e) =>
              setFormValues((pre) => ({
                ...pre,
                role: e.target.value as string,
              }))
            }
            label="Sélectionnez le rôle"
            value={formValues.role}
          >
            <MenuItem value="" disabled>
              Quel est votre rôle
            </MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="secrétaire">Secrétaire</MenuItem>
          </Select>
        </FormControl>
      </div>
      <button
        type="submit"
        style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
        className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
        disabled={loading}
      >
        {loading ? "Chargement..." : "Se connecter"}
      </button>
    </form>
  );
};
