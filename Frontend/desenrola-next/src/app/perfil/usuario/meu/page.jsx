'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './UserProfile.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import { authGet, authPut } from '../../../../services/http';

/**
 * Um componente de cliente que exibe e permite a edição do perfil de um usuário.
 * Ele busca os dados do usuário, gerencia um modo de edição e envia as atualizações para a API.
 * @returns {React.ReactElement} O componente da página de perfil do usuário.
 */
export default function UserProfile() {
  /** @type {[object|null, React.Dispatch<object|null>]} */
  // Armazena o objeto completo do perfil do usuário vindo da API.
  const [data, setData] = useState(null);

  /** @type {[boolean, React.Dispatch<boolean>]} */
  // Um flag para confirmar que os dados iniciais do perfil foram carregados com sucesso.
  const [profileLoaded, setProfileLoaded] = useState(false);

  /** @type {[string, React.Dispatch<string>]} */
  // Armazena as iniciais do usuário para serem exibidas no avatar.
  const [avatar, setAvatar] = useState('??');

  /** @type {[boolean, React.Dispatch<boolean>]} */
  // Controla a exibição do estado de carregamento inicial da página.
  const [loading, setLoading] = useState(true);

  /** @type {[boolean, React.Dispatch<boolean>]} */
  // Controla o estado de carregamento durante a operação de salvamento.
  const [saving, setSaving] = useState(false);

  /** @type {[string, React.Dispatch<string>]} */
  // Armazena mensagens de erro da API para exibição ao usuário.
  const [error, setError] = useState('');

  /** @type {[boolean, React.Dispatch<boolean>]} */
  // Controla se o formulário está em modo de visualização ou edição.
  const [isEditing, setIsEditing] = useState(false);

  /** @type {[object, React.Dispatch<object>]} */
  // Armazena os valores dos campos do formulário durante a edição.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    city: '',
    address: ''
  });

  const router = useRouter();

  /**
   * Efeito que busca os dados do perfil do usuário assim que o componente é montado.
   * Lida com a autenticação e redireciona para o login se o token for inválido.
   */
  useEffect(() => {
    (async () => {
      try {
        const profile = await authGet('/api/user/profile');
        setProfileLoaded(true);
        setData(profile);
        setAvatar(makeInitials(profile?.name || profile?.userName || ''));
        setFormData({
          name: profile?.name ?? '',
          email: profile?.email ?? '',
          phone: profile?.phoneNumber ?? '',
          username: profile?.userName ?? '',
          city: profile?.city ?? '',
          address: profile?.address ?? ''
        });
      } catch (e) {
        setError(e.message || 'Falha ao carregar perfil.');
        if (e.code === 401) router.replace('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  /**
   * Memoiza os dados do usuário para exibição, evitando recálculos desnecessários a cada renderização.
   * @returns {{username: string, name: string, email: string, phone: string, city: string, address: string}}
   */
  const userData = useMemo(() => ({
    username: data?.userName ?? '',
    name: data?.name ?? '',
    email: data?.email ?? '',
    phone: data?.phoneNumber ?? '',
    city: data?.city ?? '—',
    address: data?.address ?? '—',
  }), [data]);

  /** Ativa o modo de edição do formulário. */
  const handleEdit = () => setIsEditing(true);

  /** Cancela o modo de edição e reverte quaisquer alterações no formulário. */
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: data?.name ?? '',
      email: data?.email ?? '',
      phone: data?.phoneNumber ?? '',
      username: data?.userName ?? '',
      city: data?.city ?? '',
      address: data?.address ?? '',
    });
  };

  /**
   * Manipula o envio do formulário. Cria um payload `FormData`, envia para a API
   * usando `authPut` e atualiza o estado local em caso de sucesso.
   * @async
   */
  const handleSave = async () => {
    if (!profileLoaded) {
      alert('Erro: Perfil ainda não carregado. Tente novamente.');
      return;
    }

    setSaving(true);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('UserName', formData.username);
      formDataPayload.append('Name', formData.name);
      formDataPayload.append('Email', formData.email);
      // formDataPayload.append('PhoneNumber', formData.phone); // Descomente se a API aceitar este campo

      await authPut('/api/user', formDataPayload);

      const localUpdateData = {
        userName: formData.username,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
      };
      
      setData(prevData => ({ ...prevData, ...localUpdateData }));
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');

    } catch (err) {
      console.error('Erro detalhado ao salvar:', err);
      alert(`Erro ao salvar perfil: ${err.message}`);
      if (err.code === 401) router.replace('/login');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Manipulador de eventos genérico para atualizar o estado do formulário.
   * @param {string} field - O nome do campo a ser atualizado (ex: 'name').
   * @param {string} value - O novo valor do campo.
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <p style={{ padding: 24 }}>Carregando perfil...</p>
        </main>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <p style={{ padding: 24, color: '#b91c1c' }}>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatarLarge}>{avatar}</div>
            <h3 className={styles.userName}>{userData.name || userData.username}</h3>
            <p className={styles.userEmail}>{userData.email}</p>
            <button className={styles.btnPrimary}>Meu Perfil</button>
            <Link href="/finalizarcadastro">
              <button className={styles.btnSecondary}>Se Torne um Prestador</button>
            </Link>
          </div>
        </aside>

        <section className={styles.profileContent}>
          <div className={styles.profileHeader}>
            <h1>Meu Perfil</h1>
            {!isEditing ? (
              <button className={styles.btnEdit} onClick={handleEdit}>📝 Editar</button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className={styles.btnCancel} onClick={handleCancel} disabled={saving}>Cancelar</button>
                <button className={styles.btnEdit} onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : '💾 Salvar'}
                </button>
              </div>
            )}
          </div>

          <div className={styles.profileForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>NOME COMPLETO</label>
                <input type="text" value={isEditing ? formData.name : userData.name} readOnly={!isEditing} onChange={(e) => handleInputChange('name', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>EMAIL</label>
                <input type="email" value={isEditing ? formData.email : userData.email} readOnly={!isEditing} onChange={(e) => handleInputChange('email', e.target.value)} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>TELEFONE</label>
                <input type="tel" value={isEditing ? formData.phone : userData.phone} readOnly={!isEditing} onChange={(e) => handleInputChange('phone', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>USUÁRIO</label>
                <input type="text" value={isEditing ? formData.username : userData.username} readOnly={!isEditing} onChange={(e) => handleInputChange('username', e.target.value)} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>CIDADE</label>
                <input type="text" value={isEditing ? formData.city : userData.city} readOnly={!isEditing} onChange={(e) => handleInputChange('city', e.target.value)} placeholder={isEditing ? 'Digite sua cidade' : ''} />
              </div>
              <div className={styles.formGroup}>
                <label>ENDEREÇO</label>
                <input type="text" value={isEditing ? formData.address : userData.address} readOnly={!isEditing} onChange={(e) => handleInputChange('address', e.target.value)} placeholder={isEditing ? 'Digite seu endereço' : ''} />
              </div>
            </div>
            <p className={styles.disclaimer}>
              Tenha certeza de que todos os dados estão corretos. Caso não seja possível alterar, entre em contato com o suporte.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * Uma função utilitária para gerar as iniciais a partir de um nome completo.
 * @param {string | null | undefined} fullName - O nome completo do usuário.
 * @returns {string} As iniciais geradas (ex: "JL" para "Jorge Luis").
 */
function makeInitials(fullName) {
  if (!fullName) return '??';
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || (parts[0]?.slice(0, 2).toUpperCase());
}