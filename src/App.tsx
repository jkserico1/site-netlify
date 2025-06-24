import React, { useState, useEffect } from 'react';
import { Search, User, Heart, MapPin, Image, MessageCircle, Lock, Shield, CheckCircle, Eye, Activity, AlertTriangle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [profileFound, setProfileFound] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3 * 60 + 45); // 3:45 minutes in seconds
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(0);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Popup messages for step 1
  const popupMessages = [
    { name: "Beatriz N.", message: "encontrou fotos comprometedoras do namorado" },
    { name: "Joana B.", message: "descobriu conversas suspeitas" },
    { name: "Lucas V.", message: "viu o Tinder ativo em outro celular" },
    { name: "Marina C.", message: "flagrou o parceiro online no app" },
    { name: "Roberto S.", message: "descobriu matches recentes da esposa" }
  ];

  // Testimonials for carousel
  const testimonials = [
    {
      name: "Ana S.",
      location: "São Paulo",
      time: "há 2 horas",
      message: "Descobri que meu namorado estava marcando encontros no Tinder enquanto eu trabalhava. Graças ao SigIlox pude pegar ele em flagrante!"
    },
    {
      name: "Carlos R.",
      location: "Rio de Janeiro",
      time: "há 1 hora",
      message: "Minha esposa dizia que não tinha mais o Tinder, mas descobri que estava TODOS OS DIAS estava marcando encontros!"
    },
    {
      name: "Beatriz M.",
      location: "Belo Horizonte",
      time: "há 3 horas",
      message: "Suspeitas confirmadas! Ele estava usando fotos antigas e conversando com várias mulheres. Agora tenho as provas!"
    }
  ];

  // Images based on selected gender
  const getImagesForGender = (gender: string) => {
    if (gender === 'masculino') {
      return [
        'https://i.imgur.com/uZ4mlyx.jpeg',
        'https://i.imgur.com/iE9PMJv.jpeg',
        'https://i.imgur.com/Cd5pP81.jpeg'
      ];
    } else if (gender === 'feminino') {
      return [
        'https://i.imgur.com/LXqBFbJ.jpeg',
        'https://i.imgur.com/UqdRhat.jpeg',
        'https://i.imgur.com/7wfghSD.jpeg'
      ];
    }
    return [];
  };

  // Timer countdown
  useEffect(() => {
    if (currentStep === 4 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, timeLeft]);

  // Show popup after 3 seconds on step 1, then cycle through them
  useEffect(() => {
    if (currentStep === 1) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);

      const cycleTimer = setInterval(() => {
        setCurrentPopup(prev => (prev + 1) % popupMessages.length);
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearInterval(cycleTimer);
      };
    }
  }, [currentStep]);

  // Testimonial carousel
  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialTimer);
  }, []);

  // Image carousel for step 3
  useEffect(() => {
    if (currentStep === 3) {
      const imageTimer = setInterval(() => {
        const images = getImagesForGender(selectedGender);
        if (images.length > 0) {
          setCurrentImageIndex(prev => (prev + 1) % images.length);
        }
      }, 2500);

      return () => clearInterval(imageTimer);
    }
  }, [currentStep, selectedGender]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateBrazilianPhone = (phone: string) => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Brazilian phone format: 11 digits (DDD + 9 digits)
    // DDD: 11-99, Phone: 9XXXX-XXXX or 8XXXX-XXXX
    if (cleanPhone.length !== 11) return false;
    
    const ddd = cleanPhone.substring(0, 2);
    const firstDigit = cleanPhone.substring(2, 3);
    
    // Valid DDDs in Brazil
    const validDDDs = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
      '21', '22', '24', // RJ
      '27', '28', // ES
      '31', '32', '33', '34', '35', '37', '38', // MG
      '41', '42', '43', '44', '45', '46', // PR
      '47', '48', '49', // SC
      '51', '53', '54', '55', // RS
      '61', // DF
      '62', '64', // GO
      '63', // TO
      '65', '66', // MT
      '67', // MS
      '68', // AC
      '69', // RO
      '71', '73', '74', '75', '77', // BA
      '79', // SE
      '81', '87', // PE
      '82', // AL
      '83', // PB
      '84', // RN
      '85', '88', // CE
      '86', '89', // PI
      '91', '93', '94', // PA
      '92', '97', // AM
      '95', // RR
      '96', // AP
      '98', '99' // MA
    ];
    
    if (!validDDDs.includes(ddd)) return false;
    
    // Mobile numbers start with 9, landline with 2-5 or 8
    if (firstDigit !== '9' && !['2', '3', '4', '5', '8'].includes(firstDigit)) return false;
    
    return true;
  };

  const formatPhoneNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '$1$2$3');
    }
    return cleanValue.substring(0, 11);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleVerify = () => {
    if (phoneNumber && selectedGender && validateBrazilianPhone(phoneNumber)) {
      setShowVerificationPopup(true);
      setVerificationStep(0);
      
      // Step 1: Connecting
      setTimeout(() => {
        setVerificationStep(1);
      }, 1500);
      
      // Step 2: Searching
      setTimeout(() => {
        setVerificationStep(2);
      }, 3000);
      
      // Step 3: Profile found
      setTimeout(() => {
        setVerificationStep(3);
        setProfileFound(true);
      }, 4500);
      
      // Step 4: Go to next step
      setTimeout(() => {
        setShowVerificationPopup(false);
        setCurrentStep(3);
      }, 6500);
    }
  };

  const handleViewComplete = () => {
    setCurrentStep(4);
    // Scroll to step 4 section after a brief delay to ensure it's rendered
    setTimeout(() => {
      const step4Element = document.getElementById('step4-section');
      if (step4Element) {
        step4Element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleFinalRedirect = () => {
    // === AQUI É ONDE VOCÊ ADICIONA O CÓDIGO DA UTMIFY ===
    if (window.utmify && window.utmify.pixel) {
        window.utmify.pixel.track('InitiateCheckout', {
            // Opcional: Adicione informações relevantes que a UTMify possa usar.
            // Por exemplo, o valor do produto, moeda, IDs do conteúdo.
            // Isso ajuda a otimizar o rastreamento e futuras campanhas.
            value: 14.90, // O valor de R$14,90 que você mostra no checkout
            currency: 'BRL', // Moeda brasileira
            content_ids: ['sigilox_acesso_completo'], // Um ID único para essa oferta
            content_name: 'Acesso Completo ao Relatório Tinder', // Nome do produto/oferta
            content_category: 'servico_assinatura' // Categoria, se aplicável
        });
        console.log('Evento InitiateCheckout da UTMify disparado!');
    } else {
        console.warn('Pixel da UTMify não carregado ou não disponível ao tentar disparar InitiateCheckout.');
    }
    // === FIM DA ADIÇÃO DO CÓDIGO DA UTMIFY ===

    window.location.href = 'https://checkout.lojaonlinee.site/VCCL1O8SBXH3';
  };

  const nextImage = () => {
    const images = getImagesForGender(selectedGender);
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = getImagesForGender(selectedGender);
    if (images.length > 0) {
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };

  const isPhoneValid = phoneNumber && validateBrazilianPhone(phoneNumber);

  if (currentStep === 1) {
    return (
      <div className="min-h-screen tinder-gradient relative">
        {/* Header Banner */}
        <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-medium">
          ⚠️ OFERTA LIMITADA: Apenas 34 testes gratuitos restantes hoje!
        </div>

        {/* Popup Notifications */}
        {showPopup && (
          <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
            <div className="bg-white rounded-2xl p-4 shadow-xl max-w-xs">
              <div className="flex items-start space-x-3">
                <div className="bg-pink-500 rounded-full p-2 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-gray-800">{popupMessages[currentPopup].name}</p>
                  <p className="text-gray-600">{popupMessages[currentPopup].message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Container with Floating White Block */}
        <div className="px-4 py-6">
          {/* Floating White Container */}
          <div 
            className="bg-white rounded-3xl p-6 mt-6"
            style={{
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Search Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-pink-100 rounded-full p-3">
                <Search className="w-6 h-6 text-pink-500" />
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-4">
              <h1 className="text-gray-800 text-xl font-bold mb-2 leading-tight">
                SEU PARCEIRO ESTÁ NO TINDER?
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Descubra AGORA se ele(a) está te traindo - 100% anônimo e sem ele(a) saber!
              </p>
            </div>

            {/* Active Users */}
            <div className="flex justify-center mb-4">
              <div 
                className="inline-block px-4 py-2 rounded-2xl text-sm font-bold"
                style={{
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  color: '#00ff88'
                }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full inline-block mr-2"></div>
                1256 pessoas descobrindo a verdade agora
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 mb-4">
              <button className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-2xl font-medium text-sm border border-gray-200">
                DESCOBRIR A VERDADE
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-2xl font-medium text-sm border border-gray-200">
                TECNOLOGIA AVANÇADA
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-2xl font-medium text-sm border border-gray-200">
                TOTALMENTE SEGURO
              </button>
            </div>

            {/* Unlock Access Button */}
            <div className="text-center mb-4">
              <button 
                onClick={() => setCurrentStep(2)}
                className="w-full text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center animate-pulse-gentle"
                style={{
                  background: 'linear-gradient(135deg, #fd267a, #ff7854)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <Lock className="w-4 h-4 mr-2" />
                QUERO DESBLOQUEAR O ACESSO AO TESTE GRÁTIS!
              </button>
            </div>

            {/* Recent Activity */}
            <div className="text-center">
              <div className="flex items-center justify-center">
                <span className="text-yellow-500 mr-1">⚡</span>
                <span className="text-gray-600 text-xs">
                  Últimas 74 pessoas descobriram traições nas últimas 2 horas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Combined Section - What you'll discover */}
        <div className="bg-gray-50 px-6 py-8">
          {/* Section Title */}
          <h2 className="text-gray-800 text-xl font-bold text-center mb-8 leading-tight">
            O QUE VOCÊ VAI DESCOBRIR SOBRE SEU PARCEIRO
          </h2>

          {/* Features List */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 rounded-full p-2 mt-1">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">ATIVIDADE RECENTE</h3>
                <p className="text-gray-600 text-sm">
                  Veja quando ele(a) usou o Tinder pela última vez - até mesmo HOJE!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 rounded-full p-2 mt-1">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">LOCALIZAÇÃO EXATA</h3>
                <p className="text-gray-600 text-sm">
                  Onde ele(a) está marcando encontros às suas costas
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 rounded-full p-2 mt-1">
                <Image className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">FOTOS ÍNTIMAS</h3>
                <p className="text-gray-600 text-sm">
                  Todas as fotos que ele(a) está mostrando para outros
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 rounded-full p-2 mt-1">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">CONVERSAS EXPLÍCITAS</h3>
                <p className="text-gray-600 text-sm">
                  O que ele(a) está dizendo para outras pessoas
                </p>
              </div>
            </div>
          </div>

          {/* Don't Stay in Doubt Section */}
          <div className="text-center mb-8">
            <h3 className="font-bold text-gray-800 text-lg mb-6">
              NÃO FIQUE NA DÚVIDA - VEJA O QUE OUTROS DESCOBRIRAM
            </h3>

            {/* Testimonials Carousel */}
            <div className="mb-8 relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="bg-pink-500 rounded-full p-2">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-800 text-sm">{testimonial.name}</p>
                          <p className="text-gray-500 text-xs">{testimonial.location} • {testimonial.time}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm text-left italic">
                        "{testimonial.message}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentTestimonial ? 'bg-pink-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={() => setCurrentStep(2)}
              className="w-full tinder-gradient text-white py-4 rounded-full font-bold text-lg animate-pulse-gentle"
            >
              QUERO SABER A VERDADE AGORA
            </button>

            <p className="text-gray-500 text-sm mt-4">
              🔒 100% anônimo - ele(a) NUNCA vai saber que você verificou
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50 relative">
        {/* Header Banner */}
        <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-medium">
          ⚠️ OFERTA LIMITADA: Apenas 33 testes gratuitos restantes hoje!
        </div>

        {/* Verification Popup */}
        {showVerificationPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              {verificationStep === 0 && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <h3 className="font-bold text-gray-800 mb-2">VERIFICANDO AGORA...</h3>
                  <p className="text-gray-600 text-sm">Conectando aos servidores do WhatsApp...</p>
                </div>
              )}
              
              {verificationStep === 1 && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                  <h3 className="font-bold text-gray-800 mb-2">BUSCANDO INFORMAÇÕES...</h3>
                  <p className="text-gray-600 text-sm">Buscando informações do perfil...</p>
                </div>
              )}
              
              {verificationStep === 2 && (
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 rounded-full h-12 w-12 mx-auto mb-4"></div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">ANALISANDO DADOS...</h3>
                  <p className="text-gray-600 text-sm">Verificando atividade no Tinder...</p>
                </div>
              )}
              
              {verificationStep === 3 && (
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="bg-white border-2 border-pink-500 rounded-2xl p-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-bold text-gray-800">+55 {phoneNumber}</p>
                    <div className="flex items-center justify-center mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-bold text-sm">Perfil encontrado</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-pink-500 mb-2">PERFIL ATIVO CONFIRMADO!</h3>
                  <p className="text-gray-600 text-sm">Este número está vinculado a um perfil ativo no Tinder</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="px-6 py-8">
          {/* WhatsApp Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-500 rounded-full p-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-gray-800 text-2xl font-bold mb-2">
              VERIFIQUE AGORA
            </h1>
            <p className="text-gray-600">
              Preencha os dados para descobrir a verdade
            </p>
          </div>

          {/* Progress */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm">
              Passo 1 de 3 - Informações básicas
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="block text-gray-800 font-bold mb-3">
                Número de WhatsApp dele ou dela?
              </label>
              <div className="flex">
                <div className="bg-gray-100 border border-gray-300 rounded-l-lg px-3 py-3 text-gray-600">
                  +55
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="DDD + número (ex: 11987654321)"
                  className={`flex-1 border rounded-r-lg px-4 py-3 focus:outline-none ${
                    phoneNumber && !isPhoneValid 
                      ? 'border-red-500 focus:border-red-500' 
                      : phoneNumber && isPhoneValid
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:border-pink-500'
                  }`}
                  maxLength={11}
                />
              </div>
              <div className="flex items-center mt-2">
                <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                  phoneNumber && !isPhoneValid ? 'bg-red-400' : 'bg-yellow-400'
                }`}>
                  <span className="text-white text-xs">
                    {phoneNumber && !isPhoneValid ? '✕' : '!'}
                  </span>
                </div>
                <p className={`text-sm ${
                  phoneNumber && !isPhoneValid ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {phoneNumber && !isPhoneValid 
                    ? 'Número inválido. Digite um número brasileiro válido'
                    : 'Digite o número que ele(a) usa no WhatsApp'
                  }
                </p>
              </div>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-gray-800 font-bold mb-3">
                Foto do perfil
              </label>
              <div className="flex justify-center mb-3">
                <div className="w-24 h-24 border-4 border-pink-500 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-gray-600 text-sm">
                  A foto será carregada automaticamente
                </p>
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-gray-800 font-bold mb-3">
                Gênero dele(a)
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <button
                  onClick={() => setSelectedGender('masculino')}
                  className={`border-2 rounded-lg py-4 px-3 text-center transition-colors ${
                    selectedGender === 'masculino'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  style={{
                    borderColor: selectedGender === 'masculino' ? '#fd267a' : '#d1d5db'
                  }}
                >
                  <div className="text-2xl mb-1">♂</div>
                  <div className="text-sm font-medium">Masculino</div>
                </button>
                <button
                  onClick={() => setSelectedGender('feminino')}
                  className={`border-2 rounded-lg py-4 px-3 text-center transition-colors ${
                    selectedGender === 'feminino'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  style={{
                    borderColor: selectedGender === 'feminino' ? '#fd267a' : '#d1d5db'
                  }}
                >
                  <div className="text-2xl mb-1">♀</div>
                  <div className="text-sm font-medium">Feminino</div>
                </button>
                <button
                  onClick={() => setSelectedGender('nao-binario')}
                  className={`border-2 rounded-lg py-4 px-3 text-center transition-colors ${
                    selectedGender === 'nao-binario'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  style={{
                    borderColor: selectedGender === 'nao-binario' ? '#fd267a' : '#d1d5db'
                  }}
                >
                  <div className="text-2xl mb-1">⚧</div>
                  <div className="text-sm font-medium">Não Binário</div>
                </button>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Selecione o gênero para melhor precisão
                </p>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-gray-100 border-l-4 border-pink-500 p-4 rounded">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-gray-700 mr-2" />
                <span className="font-bold text-gray-800">Sua privacidade está protegida</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Dados criptografados</span>
                  <User className="w-4 h-4 text-green-500 ml-auto" />
                  <span className="ml-1">100% anônimo</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-2" />
                  <span>Dados apagados após 24h</span>
                  <Eye className="w-4 h-4 text-green-500 ml-auto" />
                  <span className="ml-1">Ele(a) nunca saberá</span>
                </div>
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isPhoneValid || !selectedGender}
              className={`w-full py-4 rounded-full font-bold text-lg animate-pulse-gentle ${
                isPhoneValid && selectedGender
                  ? 'tinder-gradient text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              VERIFICAR AGORA - QUERO SABER A VERDADE
            </button>

            <p className="text-center text-gray-500 text-sm">
              🔒 100% confidencial - ele(a) NUNCA vai saber que você verificou
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep >= 3 && profileFound) {
    const images = getImagesForGender(selectedGender);
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Banner */}
        <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-medium">
          ⚠️ OFERTA LIMITADA: Apenas 32 testes gratuitos restantes hoje!
        </div>

        {/* Profile Found Notification */}
        <div className="tinder-gradient px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-white rounded-full p-2">
                <User className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">PERFIL ENCONTRADO!</p>
                <p className="text-white text-sm opacity-90 animate-blink">Ativo agora no Tinder</p>
              </div>
            </div>
            <div className="text-white text-sm font-medium">
              Relatório
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Alert with Gradient Background */}
          <div 
            className="text-white rounded-lg p-4 mb-6"
            style={{
              background: 'linear-gradient(90deg, #f72585 0%, #ffb347 100%)'
            }}
          >
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">⚠️</span>
              <span className="font-bold">ATENÇÃO: PERFIL ATIVO ENCONTRADO!</span>
            </div>
            <p className="text-sm">
              Confirmamos que este número está vinculado a um perfil ATIVO no Tinder.
            </p>
          </div>

          {/* What do you want to do? */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🤔</span>
              <h3 className="font-bold text-gray-800 text-lg">
                O que você quer fazer agora?
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Image className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-bold text-gray-800">Ver as fotos que ele(a) está usando</span>
                </div>
                <p className="text-gray-600 text-sm ml-8">
                  Descubra que imagens ele(a) está mostrando para outros
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-bold text-gray-800">Ver atividade completa</span>
                </div>
                <p className="text-gray-600 text-sm ml-8">
                  Matches, curtidas e quando foi visto online
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-bold text-gray-800">Ver onde ele(a) está ativo</span>
                </div>
                <p className="text-gray-600 text-sm ml-8">
                  Localizações onde está usando o Tinder
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section with Images */}
          <div className="bg-gray-800 rounded-lg p-4 text-white relative overflow-hidden mb-6">
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-blink">
                ● ONLINE AGORA!
              </span>
            </div>
            <div className="absolute top-2 right-2">
              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                ⚡ TESTE GRÁTIS
              </span>
            </div>
            
            <div className="text-center pt-8">
              <h4 className="font-bold text-lg mb-4">
                FOTOS ENCONTRADAS NO PERFIL
              </h4>
              
              {/* Single Image with Carousel */}
              {images.length > 0 && (
                <div className="relative mb-4">
                  <div className="flex justify-center">
                    <div className="relative w-48 h-48">
                      <img
                        src={images[currentImageIndex]}
                        alt={`Foto ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover rounded-2xl"
                        style={{ 
                          borderRadius: '16px',
                          filter: 'blur(8px)'
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="flex justify-center mt-2 space-x-2">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center mb-4">
                <span className="text-yellow-400 mr-2">⚠️</span>
                <span className="text-sm">Seu teste grátis está quase acabando!</span>
              </div>
              
              <button 
                onClick={handleViewComplete}
                className="w-full tinder-gradient text-white py-3 rounded-full font-bold animate-pulse-gentle"
              >
                🔓 VER FOTOS COMPLETAS AGORA
              </button>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500 mb-1">5</div>
                <div className="text-xs text-gray-600">MATCHES (7 DIAS)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500 mb-1">10</div>
                <div className="text-xs text-gray-600">CURTIDAS (7 DIAS)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500 mb-1">4</div>
                <div className="text-xs text-gray-600">DIAS ATIVOS</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-gray-700 mr-2" />
                <span className="font-bold text-gray-800">ATIVIDADE RECENTE</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Deu match com 5 pessoas</p>
                    <p className="text-xs text-gray-500">Últimos 7 dias</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Recebeu 10 curtidas</p>
                    <p className="text-xs text-gray-500">Últimos 7 dias</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Usou o Tinder em uma nova localização</p>
                    <p className="text-xs text-gray-500">Hoje às 10:21</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 Content - Only show when currentStep is 4 */}
        {currentStep === 4 && (
          <div id="step4-section" className="bg-white p-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-md mx-auto p-6 relative">
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 tinder-gradient rounded-t-2xl"></div>
              
              {/* Alert Icon */}
              <div className="flex justify-center mb-6 mt-4">
                <div className="bg-red-500 rounded-full p-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-gray-800 text-xl font-bold mb-2">
                  SEU TESTE GRÁTIS ENCONTROU RESULTADOS!
                </h1>
              </div>

              {/* Confirmed Badge */}
              <div className="bg-green-100 border border-green-300 rounded-full py-2 px-4 mb-6">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium text-sm">CONFIRMADO!</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-center text-gray-700 mb-6 text-sm leading-relaxed">
                Encontramos o perfil ativo que você estava procurando.
              </p>

              {/* Report Features */}
              <div className="border-l-4 border-pink-500 pl-4 mb-6">
                <div className="mb-3">
                  <div className="flex items-center text-pink-600 font-bold text-sm mb-1">
                    <Image className="w-4 h-4 mr-2" />
                    Para ver o relatório COMPLETO:
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Image className="w-4 h-4 text-gray-400 mr-3" />
                    <span>Todas as fotos SEM CENSURA</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 text-gray-400 mr-3" />
                    <span>Conversas explícitas</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                    <span>Localização exata dos encontros</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 text-gray-400 mr-3" />
                    <span>Histórico completo de atividade</span>
                  </div>
                </div>
              </div>

              {/* Special Offer */}
              <div className="bg-yellow-400 rounded-lg p-4 mb-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-gray-800">🎁 OFERTA ESPECIAL</span>
                </div>
                <p className="text-gray-800 font-bold text-sm">
                  70% OFF só para você que usou o teste grátis!
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-pink-600">R$14,90</span>
                  <div className="ml-3">
                    <span className="text-gray-500 line-through text-sm">R$67,90</span>
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full inline-block ml-1">
                      -78%
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handleFinalRedirect}
                className="w-full tinder-gradient text-white py-4 rounded-full font-bold text-sm mb-4 animate-pulse-gentle"
              >
                QUERO VER TUDO AGORA!
              </button>

              {/* Timer */}
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-yellow-700 font-medium text-sm">
                    OFERTA VÁLIDA POR APENAS {formatTime(timeLeft)} MINUTOS!
                  </span>
                </div>
              </div>

              {/* Security Features */}
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <Shield className="w-3 h-3 text-green-500 mr-1" />
                  <span>Pagamento seguro</span>
                </div>
                <div className="flex items-center">
                  <User className="w-3 h-3 text-green-500 mr-1" />
                  <span>100% anônimo</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                  <span>Acesso imediato</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default App;
