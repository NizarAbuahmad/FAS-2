/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  AdminUser, 
  CarouselSlide, 
  ContactDetails, 
  ContactMessage, 
  MediaAsset, 
  Post, 
  AnalyticsSummary,
  CustomPage,
  SiteText,
  GalleryItem
} from "./types";
import { translations, applyTranslationOverrides } from "./utils/translations";

// Component imports
import Navbar from "./components/Navbar";
import SchoolLogo from "./components/SchoolLogo";
import HeroCarousel from "./components/HeroCarousel";
import BriefIntro from "./components/BriefIntro";
import TracksSection from "./components/TracksSection";
import ContactForm from "./components/ContactForm";
import DashboardLayout from "./components/DashboardLayout";
import PostManager from "./components/PostManager";
import CarouselManager from "./components/CarouselManager";
import GalleryManager from "./components/GalleryManager";
import MediaManager from "./components/MediaManager";
import MessagesManager from "./components/MessagesManager";
import SettingsManager from "./components/SettingsManager";
import UserManager from "./components/UserManager";
import PagesManager from "./components/PagesManager";
import SiteTextsManager from "./components/SiteTextsManager";
import PageRenderer from "./components/PageRenderer";

// Lucide icons
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  Smartphone,
  MapPin, 
  Lock, 
  AlertCircle, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Clock,
  Facebook,
  Instagram,
  ArrowLeft
} from "lucide-react";

// Fallback baseline client-side state
const OFFLINE_FALLBACK = {
  posts: [
    {
      id: "post-1",
      titleEn: "Admission & Registration Open for Academic Year 2026/2027",
      titleAr: "فتح باب القبول والتسجيل للعام الدراسي الجديد 2026/2027",
      contentEn: "We are thrilled to announcement that admission and registration are now open across all school divisions (KG, National, and International Cambridge IGCSE programs) for the upcoming school session. At First Academy School Amman (FAS), we pride ourselves on nurturing safe environments, strong morals, and balanced learning tracks tailored to spark every learner's maximum capacity. Schedule a private tour or submit an online query now.",
      contentAr: "يسرنا أن نعلن عن فتح باب القبول والتسجيل بجميع المسارات والصفوف التعليمية (الروضة، البرنامج الوطني، وبرنامج كامبريدج الدولي IGCSE) للعام الدراسي القادم. في روضة ومدارس الأكاديمية الأولى، نفخر بتوفير بيئة تعليمية آمنة ومحفزة تنمي القيم الأخلاقية الراسخة وتدعم نمو أطفالنا في كافة النواحي. احجز جولة خاصة بالحرم المدرسي الآن.",
      descriptionEn: "Registration is officially open from Kindergarten up to Grade 12. Choose English IGCSE or National Track.",
      descriptionAr: "بدء التسجيل من صفوف الروضة والتمهيدي وحتى الصف الثاني عشر (التوجيهي وبرنامج IGCSE).",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
      date: "2026-05-20",
      categoryEn: "Admissions",
      categoryAr: "القبول والتسجيل",
      authorEn: "Admissions Office",
      authorAr: "مكتب القبول",
      published: true,
      views: 142
    },
    {
      id: "post-2",
      titleEn: "Annual Spelling Bee Competition Winners Awarded",
      titleAr: "تتويج الفائزين بمسابقة التهجئة السنوية Spelling Bee",
      contentEn: "Our elementary and middle-school English outstanding spellers gathered for the final rounds of our English Spelling Bee Championship. Congratulations to our grade 5 & 8 champions who demonstrated beautiful speech, fast vocabulary recall, and high composure on stage. Special thanks to our teachers and parent committees who supported this brilliant exercise in academic commitment.",
      contentAr: "اجتمع طلابنا ومعلمونا لتتويج الفائزين بالنهائيات ببطولة التهجئة السنوية للغة الإنجليزية Spelling Bee للبراعم الطموحة. نهنئ أبطال الصفين الخامس والثامن على آدائهم المتميز وثباتهم الرائع على المسرح. كل الشكر والتقدير لجهود المعلمين الداعمة ولجان أولياء الأمور.",
      descriptionEn: "Congratulations to our stars across elementary and middle school spelling tiers.",
      descriptionAr: "نهنئ نجومنا الفائزين في مسابقة التهجئة للغة الإنجليزية السنوية.",
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
      date: "2026-05-18",
      categoryEn: "Academics",
      categoryAr: "الأنشطة الأكاديمية",
      authorEn: "English Department",
      authorAr: "قسم اللغة الإنجليزية",
      published: true,
      views: 95
    }
  ],
  slides: [
    {
      "id": "slide-1",
      "titleEn": "First Academy School Campus",
      "titleAr": "حرم الأكاديمية الأولى والملاعب الخضراء",
      "subtitleEn": "Extensive grass turf football field and safe modern campus buildings.",
      "subtitleAr": "ملاعب عشبية خضراء خارجية متكاملة وبيئة تعليمية تربوية آمنة وحافلة لمستقبل واعد.",
      "image": "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=1600",
      "link": "#about",
      "order": 1
    },
    {
      "id": "slide-2",
      "titleEn": "Welcome Back to School Greetings",
      "titleAr": "مرحباً بأبطالنا وبراعمنا في العام الجديد",
      "subtitleEn": "Smiles, custom booklets, stories, back-to-school banners, and high academic excitement.",
      "subtitleAr": "نستقبل العام الدراسي بكل همة ونشاط مع توزيع القصص والكتب والأنشطة الترفيهية المبهجة.",
      "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1600",
      "link": "#about",
      "order": 2
    },
    {
      "id": "slide-3",
      "titleEn": "Joyful Kindergarten & Learning Arch",
      "titleAr": "قسم الروضة والأقسام التفاعلية للأطفال",
      "subtitleEn": "Cute happy kindergarteners with colorful helium balloon arches and encouraging classrooms.",
      "subtitleAr": "فعاليات البراعم والروضة مع زينات البالونات الملونة وبدايات سعيدة ومحفزة لنموهم المتكامل بمساراتنا.",
      "image": "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=1600",
      "link": "#tracks",
      "order": 3
    },
    {
      "id": "slide-4",
      "titleEn": "Creative School Plays & Mother's Day",
      "titleAr": "المسرح المدرسي وااحتفالية عيد الأم الكبرى",
      "subtitleEn": "Students performing with hearts and massive white letters under gorgeous spotlights.",
      "subtitleAr": "نكتشف مواهب أطفالنا على مسرح المدرسة، محتفين بالأم الغالية عبر الفنون والفقرات التربوية المؤثرة.",
      "image": "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1600",
      "link": "#about",
      "order": 4
    },
    {
      "id": "slide-5",
      "titleEn": "Sports Development & School Football Team",
      "titleAr": "الأنشطة الرياضية وفريق كرة القدم المتميّز",
      "subtitleEn": "Coach-led soccer practices on green playgrounds to build fitness and high athletic spirit.",
      "subtitleAr": "تدريبات مستمرة لفريق المدرسة لكرة القدم بالملاعب العشبية لبناء اللياقة البدنية والروح الرياضية العالية.",
      "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1600",
      "link": "#contact",
      "order": 5
    }
  ],
  settings: {
    phone: "065510171",
    altPhone: "0796777980",
    email: "fas.edu.jo@gmail.com",
    notificationEmail: "fas.edu.jo@gmail.com",
    addressEn: "Madina Munawwara Street, opposite the Independent Election Commission, Amman, Jordan",
    addressAr: "عمان، شارع المدينة المنورة - مقابل الهيئة المستقلة للانتخاب",
    workingHoursEn: "Sunday - Thursday: 7:30 AM - 3:00 PM",
    workingHoursAr: "من الأحد إلى الخميس: 7:30 صباحاً حتى 3:00 مساءً",
    socialFacebook: "https://www.facebook.com/firstacademyschool",
    socialInstagram: "https://instagram.com/firstacademyschool",
    socialLinkedin: "https://linkedin.com/company/firstacademyschool",
    socialYoutube: "https://youtube.com/firstacademyschool",
    socialX: "https://twitter.com/fas_amman"
  },
  messages: [],
  media: [],
  users: [
    {
      id: "u-1",
      username: "nizar_admin",
      email: "nizar.abuahmad@gmail.com",
      role: "Admin",
      createdAt: "2026-05-01T09:00:00Z"
    },
    {
      id: "u-2",
      username: "samira_editor",
      email: "editor@firstacademy.edu.jo",
      role: "Editor",
      createdAt: "2026-05-15T12:00:00Z"
    },
    {
      id: "u-3",
      username: "guest_viewer",
      email: "guest@firstacademy.edu.jo",
      role: "Viewer",
      createdAt: "2026-05-19T10:45:00Z"
    }
  ],
  gallery: [
    {
      id: "gallery-1",
      titleEn: "Modern Interactive Computing Lab",
      titleAr: "مختبر الحاسوب والذكاء الاصطناعي الحديث",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800",
      categoryEn: "Facilities",
      categoryAr: "المرافق المدرسية",
      order: 1
    },
    {
      id: "gallery-2",
      titleEn: "Advanced Chemistry & Sciences Lab",
      titleAr: "مختبر الكيمياء والعلوم التطبيقية المتقدم",
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
      categoryEn: "Facilities",
      categoryAr: "المرافق المدرسية",
      order: 2
    },
    {
      id: "gallery-3",
      titleEn: "Spring Sports Tournament Highlights",
      titleAr: "مقتطفات من مسابقة الدوري الرياضي المدرسي",
      image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800",
      categoryEn: "Activities",
      categoryAr: "الأنشطة المدرسية",
      order: 3
    }
  ]
};

export default function App() {
  const [currentLang, setLang] = useState<"en" | "ar">("ar");
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  
  // Dashboard toggle and login modal controls
  const [isAdminMode, setAdminMode] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // DB States syncing with Server
  const [posts, setPosts] = useState<Post[]>(OFFLINE_FALLBACK.posts);
  const [slides, setSlides] = useState<CarouselSlide[]>(OFFLINE_FALLBACK.slides);
  const [settings, setSettings] = useState<ContactDetails>(OFFLINE_FALLBACK.settings);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [users, setUsers] = useState<AdminUser[]>(OFFLINE_FALLBACK.users);
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [siteTexts, setSiteTexts] = useState<SiteText[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>(OFFLINE_FALLBACK.gallery);
  const [activePageSlug, setActivePageSlug] = useState<string>("");
  const [translateRevision, setTranslateRevision] = useState<number>(0);

  // CMS active page section Tab
  const [activeTab, setActiveTab] = useState<"posts" | "carousel" | "media" | "messages" | "settings" | "users" | "pages" | "siteTexts" | "gallery">("posts");

  // JWT Helper for admin panel queries
  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("fas_auth_token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  // Securely restore JWT user sessions on page boot
  useEffect(() => {
    const savedToken = localStorage.getItem("fas_auth_token");
    const savedUser = localStorage.getItem("fas_auth_user");
    if (savedToken && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
      setAdminMode(true);
    }
  }, []);

  // Portal Authentication states
  const [loginUserId, setLoginUserId] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const t = translations[currentLang];
  const isRtl = currentLang === "ar";

  // Feed/Initial Sync
  useEffect(() => {
    fetchPublicData();
  }, [isLoggedIn, isAdminMode]);

  useEffect(() => {
    if (isLoggedIn && isAdminMode) {
      fetchAdminStats();
    }
  }, [isLoggedIn, isAdminMode, posts, slides, messages, media]);

  const fetchPublicData = async () => {
    try {
      const res = await fetch("/api/public-data");
      if (res.ok) {
        const data = await res.json();
        if (data.posts) setPosts(data.posts);
        if (data.slides) setSlides(data.slides);
        if (data.settings) setSettings(data.settings);
        if (data.media) setMedia(data.media);
        if (data.users) setUsers(data.users);
        if (data.pages) setPages(data.pages);
        if (data.gallery) setGallery(data.gallery);
        if (data.siteTexts) {
          setSiteTexts(data.siteTexts);
          applyTranslationOverrides(data.siteTexts);
          setTranslateRevision(prev => prev + 1);
        }
      }
    } catch (err) {
      console.warn("Public API connection lost. Activating offline fallback core paths.");
    }
  };

  const fetchAdminStats = async () => {
    try {
      const authHeaders = getAuthHeaders();
      const resStats = await fetch("/api/stats", { headers: authHeaders });
      const resDB = await fetch("/api/db", { headers: authHeaders });
      if (resStats.ok && resDB.ok) {
        const statsData = await resStats.json();
        const dbData = await resDB.json();
        setStats(statsData);
        setPosts(dbData.posts);
        setSlides(dbData.slides);
        setSettings(dbData.settings);
        setMessages(dbData.messages);
        setMedia(dbData.media);
        setUsers(dbData.users);
        if (dbData.gallery) setGallery(dbData.gallery);
        if (dbData.pages) setPages(dbData.pages);
        if (dbData.siteTexts) {
          setSiteTexts(dbData.siteTexts);
          applyTranslationOverrides(dbData.siteTexts);
          setTranslateRevision(prev => prev + 1);
        }
      }
    } catch {
      console.error("Failure fetching secure administrative stats.");
    }
  };

  // --- ACTIONS SYNC HANDLERS ---

  // Post opened - increment views
  const handlePostOpened = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}/view`, { method: "POST" });
    } catch {
      // offline silent pass
    }
  };

  // Save Post
  const handleSavePost = async (post: Partial<Post>): Promise<boolean> => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(post)
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Delete Post
  const handleDeletePost = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Save Carousel Slide
  const handleSaveSlide = async (slide: Partial<CarouselSlide>): Promise<boolean> => {
    try {
      const res = await fetch("/api/slides", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(slide)
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Delete Slide
  const handleDeleteSlide = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/slides/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Save Gallery Item
  const handleSaveGalleryItem = async (item: Partial<GalleryItem>): Promise<boolean> => {
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        await fetchAdminStats();
        await fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Delete Gallery Item
  const handleDeleteGalleryItem = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        await fetchAdminStats();
        await fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Save/Update Custom Page
  const handleSavePage = async (page: Partial<CustomPage>): Promise<boolean> => {
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(page)
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Delete Custom Page
  const handleDeletePage = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Save Site Texts Overrides
  const handleSaveTexts = async (txts: SiteText[]): Promise<boolean> => {
    try {
      const res = await fetch("/api/site-texts/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ texts: txts })
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Upload Media
  const handleUploadMedia = async (mediaObj: { name: string; type: string; size: number; content: string }): Promise<MediaAsset | null> => {
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(mediaObj)
      });
      if (res.ok) {
        const data = await res.json();
        const asset = data.asset;
        if (asset) {
          setMedia((prev) => [asset, ...prev]);
        }
        fetchAdminStats();
        fetchPublicData();
        return asset;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  // Delete Media
  const handleDeleteMedia = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Save Inquiry query message from Contact public page
  const handleSaveMessage = async (msg: { name: string; email: string; phone: string; subject: string; message: string }): Promise<boolean> => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg)
      });
      return res.ok;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Mark message as read
  const handleMarkMessageRead = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/messages/${id}/read`, {
        method: "PATCH",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAdminStats();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Delete message
  const handleDeleteMessage = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAdminStats();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Update Settings
  const handleUpdateSettings = async (settingsObj: Partial<ContactDetails>): Promise<boolean> => {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(settingsObj)
      });
      if (res.ok) {
        fetchAdminStats();
        fetchPublicData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Save Admin user
  const handleSaveUser = async (userObj: Partial<AdminUser>): Promise<boolean> => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(userObj)
      });
      if (res.ok) {
        fetchAdminStats();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Delete Administrative User
  const handleDeleteUser = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchAdminStats();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Darkmode toggle
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Interactive credentials selection from dynamic DB list using REST-governed salted validations
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUserId) {
      setLoginError(isRtl ? "الرجاء اختيار أحد الحسابات المتاحة." : "Please select an administrative profile.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loginUserId,
          password: secretKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        const { token, user } = data;

        // Securely write JWT token and profile to local storage for production persistence
        localStorage.setItem("fas_auth_token", token);
        localStorage.setItem("fas_auth_user", JSON.stringify(user));

        setCurrentUser(user);
        setIsLoggedIn(true);
        setAdminMode(true);
        setShowLoginModal(false);
        setLoginError("");
        setLoginUserId("");
        setSecretKey("");
      } else {
        let errMessage = "";
        try {
          const errData = await res.json();
          errMessage = errData.error;
        } catch (jsonErr) {
          errMessage = `HTTP Error ${res.status}: ${res.statusText || "Unauthorized access"}`;
        }
        setLoginError(errMessage || (isRtl ? "كلمة المرور المدخلة غير صحيحة!" : "Incorrect secure access credentials."));
      }
    } catch (err) {
      setLoginError(isRtl ? "حدث خطأ غير متوقع أثناء محاولة تسجيل الدخول. يرجى المحاولة لاحقاً." : "An unexpected error occurred during login. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fas_auth_token");
    localStorage.removeItem("fas_auth_user");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAdminMode(false);
  };

  // Testimonials template data for school portal
  const testimonials = [
    {
      id: 1,
      quoteEn: "First Academy School Amman was the birth foundation of my academic pathway. The teachers in the Cambridge track literally supported me with round-the-clock guidance to secure stars on my IG level credentials.",
      quoteAr: "كانت روضة ومدارس الأكاديمية الأولى حجر الأساس لمستقبلي الأكاديمي. كادر المعلمين في برنامج كامبريدج غمرني بنصائح ذهبية مكنتني من إحراز أعلى العلامات على مستوى المملكة.",
      authorEn: "Yasmeen Al-Khatib",
      authorAr: "ياسمين الخطيب",
      roleEn: "Cambridge Stream Alumnus (Now at UJ)",
      roleAr: "خريجة البرنامج الدولي IGCSE (تدرس الطب حالياً)"
    },
    {
      id: 2,
      quoteEn: "As parents, safe play yards, smart digital layouts, and highly ethical guidance were our top parameters when selecting a school. FAS exceeded all our targets. Our children wake up loving they are school bound.",
      quoteAr: "كأولياء أمور، كانت ساحات اللعب الآمنة والتعليم القائم على القيم والأخلاق الحجر الأساس عند اختيار مدرسة لأبنائنا. وقد فاقت الأكاديمية الأولى كل توقعاتنا فكلا طفلينا يذهبان للمدرسة بحماس وسعادة غامرة.",
      authorEn: "Dr. Hisham Kawar",
      authorAr: "الدكتور هشام قعوار",
      roleEn: "Involved FAS Parent",
      roleAr: "ولي أمر مبادر"
    }
  ];

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-[#0a0a0a] text-gray-200" : "bg-white text-slate-800"} transition-colors duration-300`}>
      
      {/* Dynamic bilingual hotline top header strip */}
      <div className="bg-[#0b0b0b] border-b border-white/5 text-gray-300 text-[11px] sm:text-xs font-semibold py-2.5 px-4 text-center select-none" dir={isRtl ? "rtl" : "ltr"}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] animate-pulse animate-duration-1000" />
            <span>
              {isRtl 
                ? "التسجيل مفتوح للعام الدراسي الجديد 2026/2027 • احجز جولة اليوم!" 
                : "Admission & registrations officially open for year 2026/2027 • Schedule a private tour!"}
            </span>
          </div>
          <div className="flex items-center gap-3" dir="ltr">
            <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] hover:scale-110 transition-all" title="Facebook">
              <Facebook size={13} />
            </a>
            <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E1306C] hover:scale-110 transition-all" title="Instagram">
              <Instagram size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* --- PUBLIC SITE OR ADMIN CMS SWITCHER --- */}
      {isAdminMode && isLoggedIn ? (
        
        /* Dashboard Layout Viewport */
        <DashboardLayout
          currentLang={currentLang}
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        >
          {activeTab === "posts" && (
            <PostManager 
              currentLang={currentLang} 
              posts={posts} 
              media={media}
              userRole={currentUser?.role || "Viewer"} 
              onSavePost={handleSavePost} 
              onDeletePost={handleDeletePost} 
              onUploadMedia={handleUploadMedia}
            />
          )}

          {activeTab === "carousel" && (
            <CarouselManager 
              currentLang={currentLang} 
              slides={slides} 
              media={media}
              userRole={currentUser?.role || "Viewer"} 
              onSaveSlide={handleSaveSlide} 
              onDeleteSlide={handleDeleteSlide} 
              onUploadMedia={handleUploadMedia}
            />
          )}

          {activeTab === "gallery" && (
            <GalleryManager 
              currentLang={currentLang} 
              gallery={gallery} 
              media={media}
              userRole={currentUser?.role || "Viewer"} 
              onSaveGalleryItem={handleSaveGalleryItem} 
              onDeleteGalleryItem={handleDeleteGalleryItem} 
              onUploadMedia={handleUploadMedia}
            />
          )}

          {activeTab === "media" && (
            <MediaManager 
              currentLang={currentLang} 
              media={media} 
              userRole={currentUser?.role || "Viewer"} 
              onUploadMedia={handleUploadMedia} 
              onDeleteMedia={handleDeleteMedia} 
            />
          )}

          {activeTab === "messages" && (
            <MessagesManager 
              currentLang={currentLang} 
              messages={messages} 
              userRole={currentUser?.role || "Viewer"} 
              onMarkRead={handleMarkMessageRead} 
              onDeleteMessage={handleDeleteMessage} 
            />
          )}

          {activeTab === "settings" && (
            <SettingsManager 
              currentLang={currentLang} 
              settings={settings} 
              userRole={currentUser?.role || "Viewer"} 
              onUpdateSettings={handleUpdateSettings} 
            />
          )}

          {activeTab === "users" && (
            <UserManager 
              currentLang={currentLang} 
              users={users} 
              userRole={currentUser?.role || "Viewer"} 
              onSaveUser={handleSaveUser} 
              onDeleteUser={handleDeleteUser} 
            />
          )}

          {activeTab === "pages" && (
            <PagesManager 
              currentLang={currentLang} 
              pages={pages} 
              userRole={currentUser?.role || "Viewer"} 
              onSavePage={handleSavePage} 
              onDeletePage={handleDeletePage} 
            />
          )}

          {activeTab === "siteTexts" && (
            <SiteTextsManager 
              currentLang={currentLang} 
              siteTexts={siteTexts} 
              userRole={currentUser?.role || "Viewer"} 
              onSaveTexts={handleSaveTexts} 
            />
          )}
        </DashboardLayout>

      ) : (

        /* Public Website Viewport Structure */
        <div className="flex flex-col">
          
          {/* Main responsive navbar */}
          <Navbar 
            currentLang={currentLang} 
            setLang={setLang} 
            isDark={isDark} 
            toggleDarkMode={toggleDarkMode}
            isAdminMode={isAdminMode}
            setAdminMode={setAdminMode}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            openLoginModal={() => setShowLoginModal(true)}
            pages={pages}
            activePageSlug={activePageSlug}
            onNavigate={setActivePageSlug}
          />

          {!activePageSlug ? (
            <>
              {/* Core high-performance dynamic image carousel with swipe & indicators */}
              <HeroCarousel slides={slides} currentLang={currentLang} />

              {/* [REMOVED StatsCounterBar isights as requested by user] */}

              {/* About core values section */}
              <BriefIntro 
                currentLang={currentLang} 
                gallery={gallery} 
                currentUser={currentUser}
                onSaveGalleryItem={handleSaveGalleryItem}
                onDeleteGalleryItem={handleDeleteGalleryItem}
                onUploadMedia={handleUploadMedia}
              />

              {/* Pathways / learning streams detail section */}
              <TracksSection currentLang={currentLang} />

              {/* TESTIMONIAL CAROUSEL PANEL (Custom slideshow) */}
              <section className="py-20 bg-[#111111] text-gray-200 border-y border-white/5 overflow-hidden relative" dir={isRtl ? "rtl" : "ltr"}>
                <div className="absolute inset-x-0 h-[3px] top-0 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-400 animate-pulse" />
                <div className="max-w-5xl mx-auto px-4 text-center space-y-8">
                  
                  <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 text-amber-500">
                    <Quote size={28} />
                  </div>
                  
                  <h2 className="text-2xl sm:text-4xl font-serif-italic italic text-white tracking-tight">
                    {t.testimonialsHeader}
                  </h2>
                  
                  {/* Slider wrapper text */}
                  <div className="min-h-52 sm:min-h-40 flex items-center justify-center">
                    <p className="text-base sm:text-xl text-gray-300 font-serif-italic italic leading-relaxed max-w-4xl font-medium">
                      "{currentLang === "en" ? testimonials[activeTestimonial].quoteEn : testimonials[activeTestimonial].quoteAr}"
                    </p>
                  </div>

                  {/* Author caption */}
                  <div className="space-y-1">
                    <p className="text-base font-bold text-white uppercase tracking-wider">
                      {currentLang === "en" ? testimonials[activeTestimonial].authorEn : testimonials[activeTestimonial].authorAr}
                    </p>
                    <p className="text-xs text-amber-400 font-sans tracking-widest uppercase">
                      {currentLang === "en" ? testimonials[activeTestimonial].roleEn : testimonials[activeTestimonial].roleAr}
                    </p>
                  </div>

                  {/* Trigger handlers */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                      onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                      className="p-2 border border-white/20 text-white rounded-lg hover:bg-white/10 hover:border-amber-500/50 hover:scale-105 transition-all"
                      aria-label="Previous Testimonial"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                      className="p-2 border border-white/20 text-white rounded-lg hover:bg-white/10 hover:border-amber-500/50 hover:scale-105 transition-all"
                      aria-label="Next Testimonial"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                </div>
              </section>

              {/* Interactive contact, admissions form and Google alerts reciever details */}
              <ContactForm currentLang={currentLang} settings={settings} onSubmitMessage={handleSaveMessage} />
            </>
          ) : (
            /* DYNAMIC CUSTOM PAGE RENDERER VIEWPORT */
            <div className="min-h-screen bg-[#0d0d0d] text-gray-100 py-24 sm:py-32" dir={isRtl ? "rtl" : "ltr"}>
              <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-8 animate-fade-in">
                
                {/* Navigation and Title header of custom page */}
                <div className="border-b border-white/15 pb-6 space-y-4">
                  <button 
                    onClick={() => setActivePageSlug("")}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:text-amber-450 transition-colors bg-white/5 hover:bg-white/10 px-4.5 py-2.5 rounded-xl border border-white/5 hover:border-white/10"
                  >
                    <ArrowLeft size={14} className={isRtl ? "rotate-180" : ""} />
                    <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
                  </button>
                  
                  {(() => {
                    const currentPageObj = pages.find(p => p.slug === activePageSlug);
                    if (!currentPageObj) return null;
                    return (
                      <div className="space-y-2">
                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                          {isRtl ? currentPageObj.titleAr : currentPageObj.titleEn}
                        </h1>
                        <p className="text-[11px] uppercase tracking-widest text-amber-500 font-mono mt-1">
                          {isRtl ? currentPageObj.titleEn : currentPageObj.titleAr}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* Page Content Body with Styled Rich Renderer */}
                <div className="prose prose-invert max-w-none">
                  {(() => {
                    const currentPageObj = pages.find(p => p.slug === activePageSlug);
                    if (!currentPageObj) {
                      return (
                        <div className="text-center py-20 text-gray-500 font-semibold">
                          {isRtl ? "عذراً، هذه الصفحة غير موجودة حالياً." : "We are sorry, this page could not be located."}
                        </div>
                      );
                    }
                    return (
                      <PageRenderer 
                        content={isRtl ? currentPageObj.contentAr : currentPageObj.contentEn} 
                        isRtl={isRtl} 
                      />
                    );
                  })()}
                </div>

                {/* Return button at bottom */}
                <div className="pt-8 border-t border-white/15 flex justify-end">
                  <button 
                    onClick={() => setActivePageSlug("")}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:text-amber-455 transition-colors bg-white/5 px-6 py-3 rounded-xl border border-white/5"
                  >
                    <ArrowLeft size={14} className={isRtl ? "rotate-180" : ""} />
                    <span>{isRtl ? "العودة لصفحات الموقع" : "Back to Home Portal"}</span>
                  </button>
                </div>

              </div>
            </div>
          )}
          
          {/* FOOTER BRANDS SCREEN */}
          <footer className="bg-slate-950 text-slate-400 py-16 text-sm" dir={isRtl ? "rtl" : "ltr"}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Brand Col 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <SchoolLogo 
                    className="w-10 h-10 object-contain p-[1px] rounded-full bg-white border border-white/10" 
                    size={40} 
                    showText={false} 
                  />
                  <span className="text-lg font-bold text-white font-sans">{isRtl ? t.arabicName : t.schoolName}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  {isRtl 
                    ? "تأسست روضة ومدارس الأكاديمية الأولى لتدريس البرنامجين الوطني والدولي وبناء جيل واعٍ متسلح بالمعرفة والفضيلة." 
                    : "Established premium learning tracks matching modern, core regional and international testing guidelines."}
                </p>
              </div>

              {/* Links Col 2 */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-350 tracking-wider uppercase font-sans">{isRtl ? "روابط سريعة" : "Main Navigation"}</h4>
                <div className="flex flex-col gap-2 font-medium">
                  <a href="#home" className="hover:text-white transition-colors">{t.navHome}</a>
                  <a href="#about" className="hover:text-white transition-colors">{t.navAbout}</a>
                  <a href="#tracks" className="hover:text-white transition-colors">{t.navTracks}</a>
                </div>
              </div>

              {/* Locations Col 3 */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-sans">{isRtl ? "العناوين والاتصال" : "Address & Contact"}</h4>
                <p className="text-xs flex items-start gap-2 leading-relaxed">
                  <MapPin size={14} className="text-[#64B5F6] flex-shrink-0 mt-0.5" />
                  <span>{currentLang === "en" ? settings.addressEn : settings.addressAr}</span>
                </p>
                <p className="text-xs flex items-center gap-2" dir="ltr">
                  <Phone size={14} className="text-[#64B5F6] flex-shrink-0" />
                  <span>
                    {isRtl ? "هاتف: " : "Tel: "}
                    <a href={`tel:${settings.phone}`} className="hover:text-amber-400 font-bold transition-colors">{settings.phone}</a>
                  </span>
                </p>
                <p className="text-xs flex items-center gap-2" dir="ltr">
                  <Smartphone size={14} className="text-[#64B5F6] flex-shrink-0" />
                  <span>
                    {isRtl ? "موبايل: " : "Mob: "}
                    <a href={`tel:${settings.altPhone}`} className="hover:text-amber-400 font-bold transition-colors">{settings.altPhone}</a>
                  </span>
                </p>
                <p className="text-xs flex items-center gap-2" dir="ltr">
                  <Mail size={14} className="text-[#64B5F6] flex-shrink-0" />
                  <span>
                    {isRtl ? "إيميل: " : "Email: "}
                    <a href={`mailto:${settings.email}`} className="hover:text-amber-400 font-bold transition-colors">{settings.email}</a>
                  </span>
                </p>
              </div>

            </div>

            <div className="pt-10 border-t border-white/5 text-center text-xs text-gray-500 font-medium tracking-wide mt-12 bg-transparent">
              First Academy School Amman © {new Date().getFullYear()}. Designed in Amman with premium precision. All rights reserved.
            </div>
          </footer>

        </div>
      )}

      {/* --- ADMINISTRATIVE LOGIN MODAL POPUP (Credentials bypass enabled for test evaluation!) --- */}
      {showLoginModal && (
        <div id="login-module-modal" className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-[#151515] border border-white/10 p-8 rounded-2xl shadow-2xl text-gray-200 space-y-6 animate-in fade-in zoom-in duration-250" dir={isRtl ? "rtl" : "ltr"}>
            
            {/* Dismiss trigger */}
            <button
              onClick={() => { setShowLoginModal(false); setLoginError(""); }}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss login modal"
            >
              <span className="font-bold text-xs">X</span>
            </button>

            {/* Title layouts */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-300 flex items-center justify-center text-black mx-auto font-black text-xl">
                <span>F</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif-italic italic text-white tracking-tight">
                {t.loginTitle}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed font-semibold font-sans">
                {t.loginSub}
              </p>
            </div>

            {/* Login Selection form bypass */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Choose template */}
              <div className="space-y-2">
                <label htmlFor="login-email-select" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  {t.loginEmailLabel}
                </label>
                <select
                  id="login-email-select"
                  value={loginUserId}
                  onChange={(e) => setLoginUserId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-[#0a0a0a] text-white text-sm focus:outline-none focus:border-amber-550 transition-colors"
                >
                  <option value="" className="bg-[#151515]">{isRtl ? "-- اختر حساب موظف لتسجيل الدخول --" : "-- Choose Profile to Login --"}</option>
                  {users.map((p) => {
                    let label = `${p.username} (${p.role})`;
                    if (currentLang === "ar") {
                      let arRole = p.role === "Admin" ? "مدير النظام" : p.role === "Editor" ? "محرر محتوى" : "مستعرض تقارير";
                      label = `${p.username} (${arRole})`;
                    }
                    return (
                      <option key={p.id} value={p.id} className="bg-[#151515]">{label} — {p.email}</option>
                    );
                  })}
                </select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="login-key-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{t.loginPasswordLabel}</label>
                <div className="relative">
                  <input
                    type="password"
                    id="login-key-input"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={t.loginKeyPlaceholder}
                    className="w-full px-4 py-2.5 border border-white/10 rounded-lg bg-[#0a0a0a] text-white text-sm focus:outline-none focus:border-amber-550 transition-colors"
                  />
                  <Lock className={`absolute ${isRtl ? "left-3" : "right-3"} top-3 text-gray-500`} size={15} />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/20 border border-red-500/30 text-rose-400 rounded-lg text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Bypassing demo advice indicator */}
              <p className="text-[10px] text-gray-500 leading-normal border border-white/5 p-2.5 rounded-lg font-medium">
                {t.loginDemoHint}
              </p>

              <button
                type="submit"
                id="btn-login-confirm"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg transition-all shadow-md active:scale-95"
              >
                {t.loginBtn}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
