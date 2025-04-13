import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';

const ThemeDebug = () => {
  const { theme } = useTheme();
  const [systemTheme, setSystemTheme] = useState('');
  const [htmlClasses, setHtmlClasses] = useState('');
  const [dataTheme, setDataTheme] = useState('');

  useEffect(() => {
    // Detectar preferência do sistema
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSystemTheme(isDarkMode ? 'dark' : 'light');

    // Obter classes do HTML
    const root = window.document.documentElement;
    setHtmlClasses(root.className);
    setDataTheme(root.getAttribute('data-theme') || 'nenhum');

    // Atualizar quando o tema mudar
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')
        ) {
          setHtmlClasses(root.className);
          setDataTheme(root.getAttribute('data-theme') || 'nenhum');
        }
      });
    });

    observer.observe(root, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [theme]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
      }}
    >
      <div><strong>Tema Atual:</strong> {theme}</div>
      <div><strong>Preferência do Sistema:</strong> {systemTheme}</div>
      <div><strong>Classes HTML:</strong> {htmlClasses}</div>
      <div><strong>data-theme:</strong> {dataTheme}</div>
      <div><strong>Background Color:</strong> <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: getComputedStyle(document.body).backgroundColor, border: '1px solid white', marginLeft: '5px' }}></span> {getComputedStyle(document.body).backgroundColor}</div>
      <div><strong>HTML Background:</strong> <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: getComputedStyle(document.documentElement).backgroundColor, border: '1px solid white', marginLeft: '5px' }}></span> {getComputedStyle(document.documentElement).backgroundColor}</div>
      <div><strong>Computed Theme:</strong> {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</div>
    </div>
  );
};

export default ThemeDebug;
