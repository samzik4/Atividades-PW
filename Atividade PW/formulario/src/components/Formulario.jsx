import React, { useState, useEffect } from "react";
import "../styles/Formulario.css";

const Formulario = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    cpf: "",
    telefoneFixo: "",
    celular: "",
    nomePai: "",
    nomeMae: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({});
  const [idade, setIdade] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para o indicador de carregamento
  const [cepError, setCepError] = useState(""); // Estado para erros de CEP

  // Função para buscar o endereço a partir do CEP
  const buscarEnderecoPorCep = async (cep) => {
    setLoading(true); // Ativa o indicador de carregamento
    setCepError(""); // Limpa erros anteriores

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
      } else {
        setFormData((prevState) => ({
          ...prevState,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }));
      }
    } catch (error) {
      setCepError("Erro ao buscar o CEP. Tente novamente.");
    } finally {
      setLoading(false); // Desativa o indicador de carregamento
    }
  };

  // Efeito para buscar o endereço quando o CEP for alterado
  useEffect(() => {
    if (formData.cep.length === 8) {
      buscarEnderecoPorCep(formData.cep);
    }
  }, [formData.cep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validação em tempo real
    if (name === "dataNascimento") {
      const idadeCalculada = calcularIdade(value);
      setIdade(idadeCalculada);
    }
  };

  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11) return false;
    // Implementar validação de dígitos verificadores (opcional)
    return true;
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha) => {
    return senha.length >= 8;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const novosErros = {};

    // Validações
    if (!formData.nomeCompleto || formData.nomeCompleto.split(" ").length < 2) {
      novosErros.nomeCompleto = "Nome completo é obrigatório (nome e sobrenome).";
    }
    if (!formData.dataNascimento || idade < 0) {
      novosErros.dataNascimento = "Data de nascimento inválida.";
    }
    if (idade < 18 && (!formData.nomePai || !formData.nomeMae)) {
      novosErros.nomePai = "Nome do pai é obrigatório para menores de 18 anos.";
      novosErros.nomeMae = "Nome da mãe é obrigatório para menores de 18 anos.";
    }
    if (!validarCPF(formData.cpf)) {
      novosErros.cpf = "CPF inválido.";
    }
    if (!validarEmail(formData.email)) {
      novosErros.email = "Email inválido.";
    }
    if (!validarSenha(formData.senha)) {
      novosErros.senha = "Senha deve ter no mínimo 8 caracteres.";
    }
    if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      alert("Formulário enviado com sucesso!");
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Informações Pessoais</h2>
      <div>
        <label>Nome Completo:</label>
        <input
          type="text"
          name="nomeCompleto"
          value={formData.nomeCompleto}
          onChange={handleChange}
        />
        {errors.nomeCompleto && <span className="erro">{errors.nomeCompleto}</span>}
      </div>
      <div>
        <label>Data de Nascimento:</label>
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
        />
        {errors.dataNascimento && <span className="erro">{errors.dataNascimento}</span>}
      </div>
      <div>
        <label>CPF:</label>
        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="XXX.XXX.XXX-XX"
        />
        {errors.cpf && <span className="erro">{errors.cpf}</span>}
      </div>
      <div>
        <label>Telefone Fixo:</label>
        <input
          type="text"
          name="telefoneFixo"
          value={formData.telefoneFixo}
          onChange={handleChange}
          placeholder="(XX) XXXX-XXXX"
        />
      </div>
      <div>
        <label>Celular:</label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          placeholder="(XX) 9XXXX-XXXX"
        />
      </div>

      {idade < 18 && (
        <>
          <h2>Informações Complementares (Menores de Idade)</h2>
          <div>
            <label>Nome do Pai:</label>
            <input
              type="text"
              name="nomePai"
              value={formData.nomePai}
              onChange={handleChange}
            />
            {errors.nomePai && <span className="erro">{errors.nomePai}</span>}
          </div>
          <div>
            <label>Nome da Mãe:</label>
            <input
              type="text"
              name="nomeMae"
              value={formData.nomeMae}
              onChange={handleChange}
            />
            {errors.nomeMae && <span className="erro">{errors.nomeMae}</span>}
          </div>
        </>
      )}

      <h2>Endereço</h2>
      <div>
        <label>CEP:</label>
        <input
          type="text"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="XXXXX-XXX"
          maxLength="8"
        />
        {loading && <span className="loading">Buscando CEP...</span>}
        {cepError && <span className="erro">{cepError}</span>}
      </div>
      <div>
        <label>Endereço:</label>
        <input
          type="text"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Número:</label>
        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Complemento:</label>
        <input
          type="text"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Cidade:</label>
        <input
          type="text"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Estado:</label>
        <input
          type="text"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        />
      </div>

      <h2>Informações da Conta</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="erro">{errors.email}</span>}
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
        />
        {errors.senha && <span className="erro">{errors.senha}</span>}
      </div>
      <div>
        <label>Confirmar Senha:</label>
        <input
          type="password"
          name="confirmarSenha"
          value={formData.confirmarSenha}
          onChange={handleChange}
        />
        {errors.confirmarSenha && <span className="erro">{errors.confirmarSenha}</span>}
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
};

export default Formulario;