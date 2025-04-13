import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Sempre usar 'dark' como padrão para forçar o tema escuro
  const savedTheme = localStorage.getItem('theme');
  console.log('Tema salvo no localStorage:', savedTheme || 'nenhum');
  const [theme, setTheme] = useState(savedTheme || 'dark');
  console.log('Tema inicial definido:', theme);

  // Função para atualizar o tema
  const updateTheme = (newTheme) => {
    console.log('Alterando tema para:', newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Aplicar o tema escuro imediatamente
  useEffect(() => {
    // Forçar o tema escuro imediatamente
    document.body.style.backgroundColor = 'hsl(217, 33%, 17%)';
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Aplicar o tema quando ele mudar
  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      const body = window.document.body;

      // Remover classes anteriores
      root.classList.remove('light', 'dark');

      // Determinar qual tema aplicar
      if (theme === 'system') {
        // Usar preferência do sistema
        root.removeAttribute('data-theme');

        // Verificar a preferência do sistema para adicionar a classe 'dark' se necessário
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('Tema: system, Preferência do sistema:', systemPrefersDark ? 'dark' : 'light');

        if (systemPrefersDark) {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        }
      } else if (theme === 'dark') {
        // Adicionar a classe 'dark' para o tema escuro
        console.log('Tema ativo: dark');
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');

        // Forçar a cor de fundo para o tema escuro
        body.style.backgroundColor = 'hsl(217, 33%, 17%)';
      } else {
        // Usar tema escolhido pelo usuário (light)
        console.log('Tema ativo: light');
        root.setAttribute('data-theme', 'light');

        // Remover o estilo forçado
        body.style.backgroundColor = '';
      }

      // Log das classes do elemento HTML após aplicar o tema
      console.log('Classes do HTML após aplicar o tema:', root.className);
      console.log('Atributos data-theme:', root.getAttribute('data-theme') || 'nenhum');
    };

    applyTheme();

    // Adicionar listener para mudanças na preferência do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      console.log('Mudança na preferência do sistema detectada!');
      console.log('Nova preferência:', mediaQuery.matches ? 'dark' : 'light');
      if (theme === 'system') {
        console.log('Aplicando novo tema baseado na preferência do sistema');
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
