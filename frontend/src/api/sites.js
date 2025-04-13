
import api from './axios';

export const getSites = async () => {
  try {
    const response = await api.get('/site');
    return { sites: response.data }; // Formatando a resposta para manter compatibilidade com o Dashboard
  } catch (error) {
    console.error("Erro ao buscar sites:", error);
    throw error;
  }
};

export const addSite = async (siteData) => {
  try {
    const response = await api.post('/site', siteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar site:", error);
    throw error;
  }
};

export const getSiteById = async (siteId) => {
  try {
    const response = await api.get(`/site/${siteId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar site ${siteId}:`, error);
    throw error;
  }
};

export const updateSite = async (siteId, siteData) => {
  try {
    // Converter as chaves para o formato esperado pelo backend
    const formattedData = {};
    if (siteData.name) formattedData.name = siteData.name;
    if (siteData.url) formattedData.url = siteData.url;
    if (siteData.apiKey) formattedData.api_key = siteData.apiKey;

    const response = await api.patch(`/site/${siteId}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar site ${siteId}:`, error);
    throw error;
  }
};

export const getDebugStatus = async (siteId) => {
  try {
    // Primeiro, obtemos os detalhes do site
    const site = await getSiteById(siteId);

    // Criamos uma URL para o endpoint de status de depuração
    const statusUrl = `${site.url}/wp-json/panel-wp/v1/debug/status`;

    // Fazemos uma requisição GET com a chave API no cabeçalho
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': site.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao obter status de depuração para o site ${siteId}:`, error);
    throw error;
  }
};

export const toggleDebug = async (siteId, enableDebug) => {
  try {
    // Primeiro, obtemos os detalhes do site
    const site = await getSiteById(siteId);

    // Criamos uma URL para o endpoint de toggle de depuração
    const toggleUrl = `${site.url}/wp-json/panel-wp/v1/debug/toggle`;

    // Fazemos uma requisição POST com a chave API no cabeçalho
    const response = await fetch(toggleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': site.apiKey
      },
      body: JSON.stringify({ ativar: enableDebug })
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Atualizar o site localmente
    await api.patch(`/site/${siteId}`, { debug_enabled: enableDebug });

    return data;
  } catch (error) {
    console.error(`Erro ao alternar modo de depuração para o site ${siteId}:`, error);
    throw error;
  }
};

export const getDebugLog = async (siteId) => {
  try {
    // Primeiro, obtemos os detalhes do site, incluindo a URL e a chave API
    const site = await getSiteById(siteId);

    // Criamos uma URL para o endpoint de visualização de log de depuração do WordPress
    const debugLogUrl = `${site.url}/wp-json/panel-wp/v1/debug/log`;

    // Fazemos uma requisição GET com a chave API no cabeçalho
    const response = await fetch(debugLogUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': site.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    // Verificamos o tipo de conteúdo da resposta
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      // Se for JSON, parseamos a resposta
      const data = await response.json();
      return data.content || data.log || JSON.stringify(data, null, 2);
    } else {
      // Se não for JSON, retornamos o texto bruto
      return await response.text();
    }
  } catch (error) {
    console.error(`Erro ao obter log de depuração para o site ${siteId}:`, error);
    throw error;
  }
};

export const clearDebugLog = async (siteId) => {
  try {
    // Primeiro, obtemos os detalhes do site
    const site = await getSiteById(siteId);

    // Criamos uma URL para o endpoint de limpeza de log de depuração
    // Endpoint correto: /wp-json/panel-wp/v1/debug/log/clear
    const clearDebugUrl = `${site.url}/wp-json/panel-wp/v1/debug/log/clear`;

    console.log('Limpando log de depuração usando URL:', clearDebugUrl);

    // Fazemos uma requisição POST com a chave API no cabeçalho
    const response = await fetch(clearDebugUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': site.apiKey
      }
    });

    if (!response.ok) {
      console.error(`Erro ao limpar log: ${response.status} ${response.statusText}`);
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta da limpeza do log:', data);
    return data;
  } catch (error) {
    console.error(`Erro ao limpar log de depuração para o site ${siteId}:`, error);
    throw error;
  }
};

export const deleteSite = async (siteId) => {
  try {
    const response = await api.delete(`/site/${siteId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir site ${siteId}:`, error);
    throw error;
  }
};

export const loginWordPress = async (siteId) => {
  try {
    // Primeiro, obtemos os detalhes do site, incluindo a URL e a chave API
    const site = await getSiteById(siteId);

    // Criamos uma URL para o novo endpoint de auto-login do WordPress
    // Usando o endpoint que foi implementado no plugin
    const autoLoginUrl = `${site.url}/wp-json/panel-wp/v1/authenticate?api_key=${encodeURIComponent(site.apiKey)}&auto_login=true`;

    // Retornamos a URL de auto-login diretamente
    // O plugin irá validar a chave API, criar o cookie de autenticação e redirecionar para o painel
    return {
      success: true,
      data: { message: "Redirecionando para login automático" },
      adminUrl: autoLoginUrl
    };
  } catch (error) {
    console.error(`Erro ao autenticar no WordPress para o site ${siteId}:`, error);
    throw error;
  }
};

export const checkSiteStatus = async (siteId) => {
  try {
    // Primeiro, obtemos os detalhes do site, incluindo a URL e a chave API
    const site = await getSiteById(siteId);

    // Criamos uma URL para o endpoint de status do WordPress
    const statusUrl = `${site.url}/wp-json/panel-wp/v1/status`;

    console.log(`Verificando status do site ${siteId} (${site.name}) em ${statusUrl}`);

    // Adicionamos um timeout para a requisição para evitar esperas muito longas
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

    try {
      // Fazemos uma requisição GET com a chave API no cabeçalho
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': site.apiKey
        },
        signal: controller.signal
      });

      // Limpar o timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        // Se a resposta não for OK, consideramos o site como offline
        console.log(`Site ${siteId} (${site.name}) está offline. Erro: ${response.status} ${response.statusText}`);
        return {
          status: 'offline',
          wp_version: 'Desconhecido',
          error: `Erro ${response.status}: ${response.statusText}`,
          checkedAt: new Date().toISOString()
        };
      }

      const data = await response.json();
      console.log(`Site ${siteId} (${site.name}) está online. Versão WordPress: ${data.wordpress_version}`);

      // Retornamos os dados de status
      return {
        status: 'online',
        wp_version: data.wordpress_version || 'Desconhecido',
        php_version: data.php_version || 'Desconhecido',
        site_url: data.site_url,
        site_name: data.site_name,
        timezone: data.timezone,
        checkedAt: new Date().toISOString(),
        ...data // Incluir quaisquer outros dados retornados pela API
      };
    } catch (fetchError) {
      // Limpar o timeout se ocorrer um erro
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error(`Erro ao verificar status do site ${siteId}:`, error);
    // Em caso de erro (como falha de rede), consideramos o site como offline
    return {
      status: 'offline',
      wp_version: 'Desconhecido',
      error: error.message,
      checkedAt: new Date().toISOString()
    };
  }
};

export const getSystemInfo = async (siteId) => {
  try {
    // Primeiro, obtemos os detalhes do site, incluindo a URL e a chave API
    const site = await getSiteById(siteId);

    // Criamos uma URL para o endpoint de informações do sistema do WordPress
    const systemInfoUrl = `${site.url}/wp-json/panel-wp/v1/system-info`;

    // Fazemos uma requisição GET com a chave API no cabeçalho
    const response = await fetch(systemInfoUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': site.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Retornamos os dados do sistema
    // Compatibilidade com o novo formato de resposta
    return {
      // Dados principais (para compatibilidade com o código existente)
      wordpress_version: data.wordpress_version || data.wordpress?.versao || 'Desconhecido',
      php_version: data.php_version || data.php?.versao || 'Desconhecido',
      mysql_version: data.mysql_version || data.banco_dados?.versao || 'Desconhecido',
      site_url: data.site_url || data.wordpress?.url || site.url,
      site_name: data.site_name || site.name,
      plugins_ativos: data.plugins_ativos || [],
      tema_atual: data.tema_atual || 'Desconhecido',

      // Dados estruturados do novo formato
      wordpress: data.wordpress,
      php: data.php,
      banco_dados: data.banco_dados,
      informacoes_servidor: data.informacoes_servidor,

      // Incluir quaisquer outros dados retornados pela API
      ...data
    };
  } catch (error) {
    console.error(`Erro ao obter informações do sistema para o site ${siteId}:`, error);
    throw error;
  }
};
