'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './UserProfile.module.css';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import { authGet, authPut } from '../../../../services/http';
import { jwtDecode } from 'jwt-decode';

export default function UserProfile() {
  const [data, setData] = useState(null);
  const [avatar, setAvatar] = useState('??');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    city: '',
    address: ''
  });

  // carrega perfil + inicializa form
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // se não houver token, vai pro login
        const rawToken = localStorage.getItem('auth_token');
        if (!rawToken) {
          window.location.replace('/login');
          return;
        }

        const profile = await authGet('/api/user/profile'); // GET com Bearer
        if (!mounted) return;

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
        if (!mounted) return;
        setError(e.message || 'Falha ao carregar perfil.');
        if (e.code === 401) {
          window.location.replace('/login');
          return;
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // dados somente leitura (exibição)
  const userData = useMemo(() => ({
    username: data?.userName ?? '',
    name: data?.name ?? '',
    email: data?.email ?? '',
    phone: data?.phoneNumber ?? '',
    city: data?.city ?? '—',
    address: data?.address ?? '—',
  }), [data]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      username: userData.username,
      city: userData.city,
      address: userData.address
    });
  };

  const handleSave = async () => {
    try {
      const rawToken = localStorage.getItem('auth_token');
      if (!rawToken) {
        alert('Token inválido. Faça login novamente.');
        window.location.replace('/login');
        return;
      }

      // Id vem do token (claim nameid)
      let userId = null;
      try {
        const decoded = jwtDecode(rawToken);
        userId = decoded?.nameid ?? null;
      } catch (err) {
        console.warn('Falha ao decodificar token:', err);
      }

      if (!userId) {
        alert('Id do usuário não encontrado no token.');
        return;
      }

      setSaving(true);

      // payload mínimo esperado pela API:
      const payload = {
        Id: userId,
        UserName: formData.username,
        Name: formData.name,
        Email: formData.email,
        // Descomente se o backend aceitar:
        // PhoneNumber: formData.phone,
        // City: formData.city,
        // Address: formData.address,
      };

      await authPut('/api/user/profile', payload); // PUT com Bearer + JSON

      // Atualiza localmente
      const updated = {
        ...data,
        userName: payload.UserName,
        name: payload.Name,
        email: payload.Email,
        // phoneNumber: formData.phone,
        // city: formData.city,
        // address: formData.address,
      };
      setData(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert(err.message || 'Erro ao salvar perfil.');
      if (err.code === 401) window.location.replace('/login');
    } finally {
      setSaving(false);
    }
  };

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
          <Link href="/login" className={styles.btnSecondary} style={{ display: 'inline-block', marginTop: 12 }}>
            Ir para login
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatarLarge}>{avatar}</div>
            <h3 className={styles.userName}>{userData.name || userData.username}</h3>
            <p className={styles.userEmail}>{userData.email}</p>

            <button className={styles.btnPrimary}>Meu Perfil</button>

       

            <Link href="/finalizarcadastro">
              <button className={styles.btnSecondary}>
                Se Torne um Prestador
              </button>
            </Link>
          </div>
        </aside>

        {/* Profile Content */}
        <section className={styles.profileContent}>
          <div className={styles.profileHeader}>
            <h1>Meu Perfil</h1>
            {!isEditing ? (
              <button className={styles.btnEdit} onClick={handleEdit}>
                📝 Editar
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className={styles.btnCancel} onClick={handleCancel} disabled={saving}>
                  Cancelar
                </button>
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
                <input
                  type="text"
                  value={isEditing ? formData.name : userData.name}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>EMAIL</label>
                <input
                  type="email"
                  value={isEditing ? formData.email : userData.email}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>TELEFONE</label>
                <input
                  type="tel"
                  value={isEditing ? formData.phone : userData.phone}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label>USUÁRIO</label>
                <input
                  type="text"
                  value={isEditing ? formData.username : userData.username}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>CIDADE</label>
                <input
                  type="text"
                  value={isEditing ? formData.city : userData.city}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={isEditing ? 'Digite sua cidade' : ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label>ENDEREÇO</label>
                <input
                  type="text"
                  value={isEditing ? formData.address : userData.address}
                  readOnly={!isEditing}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={isEditing ? 'Digite seu endereço' : ''}
                />
              </div>
            </div>

            {isEditing && (
              <div className={styles.formActions}>
                <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button className={styles.btnCancel} onClick={handleCancel} disabled={saving}>
                  Cancelar
                </button>
              </div>
            )}

            <p className={styles.disclaimer}>
              Tenha certeza de que todos os dados estão corretos. Caso não seja possível alterar, entre em contato com o suporte.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

// util simples para iniciais do avatar
function makeInitials(fullName) {
  if (!fullName) return '??';
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase() || (parts[0]?.slice(0, 2).toUpperCase());
}
