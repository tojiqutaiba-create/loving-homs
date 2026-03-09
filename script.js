function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        dateInput.min = minDate;
        dateInput.value = minDate;
    }
}

function calculateTotal() {
    let packagePrice = document.getElementById("packageType").value;
    
    let days = document.getElementById("days").value;

    if (days < 1) {
        days = 1;
        document.getElementById("days").value = 1;
    }

    let total = packagePrice * days;

    document.getElementById("totalPrice").innerText = total;
}

function initBookingForms() {
    // Handle booking forms: submit to Formspree (supports both `.booking-form` class and the main #bookingForm)
    document.querySelectorAll('.booking-form, #bookingForm').forEach(form => {
        const serviceName = form.getAttribute('data-service') || document.querySelector('h1')?.textContent || '';
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            // Add service name as hidden field
            formData.append('service', serviceName);

            fetch('https://formspree.io/f/xeelbadq', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    const name = form.querySelector('#ownerName')?.value || '';
                    const total = form.querySelector('#totalPrice')?.innerText || '';
                    const petGender = form.querySelector('input[name="petGender"]:checked')?.value || '';

                    alert("مرحباً " + name + "! تم استلام طلبك بنجاح.\nجنس الحيوان: " + petGender + "\nالتكلفة الإجمالية لإقامة أليفك هي: " + total + " دولار.");

                    form.reset();
                    setMinDate();
                    calculateTotal();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'حدث خطأ أثناء الإرسال');
                    });
                }
            })
            .catch(error => {
                console.error(error);
                alert('حدث خطأ أثناء إرسال الحجز. الرجاء المحاولة مرة أخرى.');
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
    initBookingForms();

    // Booking form submission is now handled via initBookingForms() with Formspree integration.
    // This keeps the UX consistent and avoids duplicate handlers.

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function() {
            // Ensure the reply-to header matches the email entered by the user.
            const emailInput = document.getElementById("contactEmail");
            const replyToInput = document.getElementById("replyTo");
            if (emailInput && replyToInput) {
                replyToInput.value = emailInput.value;
            }

            // Allow the form to submit normally so FormSubmit.co can email the message.
            alert("تم إرسال رسالتك! شكراً لتواصلك معنا.");
        });
    }

    const links = document.querySelectorAll('nav ul li a');
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
});

function resetForm() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    
    document.getElementById("bookingDate").value = minDate;
    document.getElementById("totalPrice").innerText = "700";
    document.getElementById("male").checked = false;
    document.getElementById("female").checked = false;
}


let currentFontSize = 16; 

function changeFontSize(delta) {

    if ((currentFontSize + delta) >= 12 && (currentFontSize + delta) <= 26) {
        currentFontSize += delta;
        document.body.style.fontSize = currentFontSize + "px";
        

        localStorage.setItem('userFontSize', currentFontSize);
    }
}

function resetFontSize() {
    currentFontSize = 16;
    document.body.style.fontSize = "16px";
    localStorage.removeItem('userFontSize');
}

window.addEventListener('DOMContentLoaded', () => {
    const savedSize = localStorage.getItem('userFontSize');
    if (savedSize) {
        currentFontSize = parseInt(savedSize);
        document.body.style.fontSize = currentFontSize + "px";
    }
});


const intentsDB = {
    location: {
        keywords: ["موقع الفندق", "اين انتم", "العنوان", "موقعكم", "مكانكم", "موقع الفندق"],
        responses: ["📍 عنواننا: شارع الرفق، حي الكلاب السعيدة، المدينة.\n📞 الهاتف: 0123456789\n📧 البريد الإلكتروني: info@lovinghomes.com\nننتظر زيارتك أنت وأليفك!"],
        suggestions: ["طريقة الحجز", "الباقات المتاحة", "الأسعار"]
    },

    price_premium: {
        keywords: ["سعر الحزمة المميزة", "بكم المميزة", "سعر المميزة"],
        responses: ["💰 الحزمة المميزة سعرها 700$ لليوم الواحد وتوفر الرفاهية الكاملة لأليفك."],
        suggestions: ["كيف يمكنني الحجز؟", "ما هي الحزمة الكلاسيكية؟", "موقع الفندق"]
    },
    price_daily: {
        keywords: ["سعر الحزمة اليومية", "بكم اليومية", "سعر اليومية"],
        responses: ["💰 الحزمة اليومية سعرها 200$ وهي مثالية للرعاية النهارية بدون مبيت."],
        suggestions: ["كيف يمكنني الحجز؟", "ما هي الحزمة المميزة؟", "موقع الفندق"]
    },
    price_classic: {
        keywords: ["سعر الحزمة الكلاسيكية", "بكم الكلاسيكية", "سعر الكلاسيكية"],
        responses: ["💰 الحزمة الكلاسيكية سعرها 500$ وتغطي كافة الاحتياجات الأساسية لإقامة مريحة."],
        suggestions: ["كيف يمكنني الحجز؟", "ما هي الحزمة المميزة؟", "موقع الفندق"]
    },

    premium_pkg: {
        keywords: ["الحزمة المميزة", "باقة مميزة", "المميزة"],
        responses: [`الحزمة المميزة:
توفر هذه الحزمة تجربة إقامة فاخرة لكلبك داخل الفندق وتشمل:

🐾 غرفة إقامة مريحة ومجهزة بالكامل  
🎾 جلسات لعب وأنشطة يومية للحفاظ على نشاط الكلب  
📸 جلسة تصوير احترافية لالتقاط أجمل اللحظات  
🦮 جلسات تدريب أساسية بإشراف مدربين متخصصين  
🍖 وجبات مخصصة حسب احتياجات الكلب  

تُعد هذه الحزمة الخيار الأفضل لأصحاب الكلاب الذين يرغبون بتجربة مميزة ومريحة لأليفهم أثناء الإقامة.

هل ترغب في معرفة السعر أو طريقة الحجز؟`],
        suggestions: ["كم سعر الحزمة المميزة؟", "ما هي الحزمة الكلاسيكية؟", "كيف يمكنني الحجز؟", "موقع الفندق"]
    },
    daily_pkg: {
        keywords: ["الحزمة اليومية", "باقة اليوم الواحد", "اليومية"],
        responses: [`الحزمة اليومية:
هذه الحزمة مناسبة للزيارات القصيرة خلال اليوم دون الحاجة إلى إقامة ليلية.
تشمل الحزمة:
🐾 استقبال الكلب ورعايته خلال فترة النهار
🎾 جلسات لعب وأنشطة ترفيهية مع الكلاب الأخرى
🌳 وقت مخصص للمشي والحركة في منطقة آمنة
🍖 تقديم وجبة خفيفة ومياه طوال فترة الزيارة
🩺 متابعة مستمرة لضمان راحة وسلامة الكلب

هل ترغب بمعرفة السعر أو طريقة الحجز؟`],
        suggestions: ["كم سعر الحزمة اليومية؟", "ما هي الحزمة المميزة؟", "كيف يمكنني الحجز؟", "موقع الفندق"]
    },
    classic_pkg: {
        keywords: ["الحزمة الكلاسيكية", "باقة كلاسيكية", "الكلاسيكية"],
        responses: [`🐾 الحزمة الكلاسيكية:
تُعد الحزمة الكلاسيكية خياراً مثالياً للإقامة المريحة للكلب لفترة أطول مع توفير احتياجاته الأساسية.
تشمل:
🏠 إقامة مريحة في مساحة مخصصة
🍖 تقديم وجبات غذائية متوازنة
🎾 جلسات لعب وأنشطة ترفيهية يومية
🌳 أوقات مخصصة للمشي والحركة
🩺 متابعة دورية لضمان سلامة الكلب.

هل ترغب بمعرفة السعر أو طريقة الحجز؟`],
        suggestions: ["ما هي الحزمة المميزة؟", "كم سعر الحزمة الكلاسيكية؟", "كيف يمكنني الحجز؟", "موقع الفندق"]
    },
    special_pkg: {
        keywords: ["المخصصة", "باقة مخصصة", "الخاصة", "حزمة مخصصة", "الحزمة الخاصة"],
        responses: [`الحزمة الخاصة (المخصصة):
يتم تصميم هذه الحزمة بالتنسيق المباشر معنا لضمان أفضل تجربة لأليفك.
يمكنك ترتيب:
🐕 نوع الرعاية المطلوبة
🍖 نظام غذائي خاص
🏠 مستوى الإقامة

لترتيبها، يرجى الاتصال بنا على 0123456789 أو زيارتنا في شارع الرفق.`],
        suggestions: ["طرق التواصل", "ما هي الحزمة المميزة؟", "طريقة الحجز"]
    },

    booking: {
        keywords: ["حجز", "احجز", "طريقة الحجز"],
        responses: ["يمكنك الذهاب لصفحة الحجز وادخل اسمك وتاريخ الحجز ونوع الحزمة وجنس الحيوان وعدد الأيام وستظهر لك التكلفة الإجمالية في النهاية."],
        suggestions: ["الأسعار", "الباقات", "موقع الفندق"]
    },
    contact: {
        keywords: ["تواصل", "اتصل", "اريد التواصل", "التواصل", "كيف اتواصل"],
        responses: [`يسعدنا تواصلك معنا! يمكنك اختيار الطريقة الأنسب لك:

1️⃣ **عبر الموقع الإلكتروني:** قم بالذهاب إلى صفحة "اتصل بنا" وتعبئة النموذج بإدخال (الاسم الكامل، البريد الإلكتروني، ورسالتك) وسنقوم بالرد عليك في أقرب وقت.

2️⃣ **عبر الهاتف مباشرة:** يمكنك الاتصال بفريق خدمة العملاء لدينا على الرقم التالي: 📞 0123456789.

نحن هنا لمساعدتك أنت وأليفك دائماً!`],
        suggestions: ["طريقة الحجز", "موقع الفندق", "الباقات المتاحة"]
    },
    price: {
        keywords: ["سعر", "اسعار","الاسعار", "بكم", "تكلفة"],
        responses: ["💰 أسعار الباقات لدينا:\n- الحزمة اليومية: 200$\n- الحزمة الكلاسيكية: 500$\n- الحزمة المميزة: 700$\n- الحزمة الخاصة: حسب الاحتياجات."],
        suggestions: ["طريقة الحجز", "الباقات", "موقع الفندق"]
    },
    packages: {
        keywords: ["باقات", "باقة", "العروض", "الخيارات", "الحزم"],
        responses: [`لدينا أربع باقات متميزة لأليفك: \n\n⚡ الحزمة اليومية\n🏠 الحزمة الكلاسيكية\n⭐ الحزمة المميزة\n🎯 الحزمة الخاصة\n\nعن أي حزمة تود الاستفسار؟`],
        suggestions: ["الحزمة اليومية", "الحزمة الكلاسيكية", "الحزمة المميزة", "الحزمة الخاصة"]
    },
   creator: {
        keywords: ["من صنعك", "مين الي برمجك","مين الي صنعك","من الذي صنعك", "مين الي صنعك","من المبرمج", "مين سواك", "من هو قتيبة", "صاحب الموقع"],
        responses: ["الي صنعني شخص اسمه قتيبة الذي قام بإنشاء هذا الموقع لتلبية احتياجات المستخدمين وخدمتهم 😊🙌"],
        suggestions: ["الباقات", "الأسعار", "موقع الفندق"]
    },
    diet: {
        keywords: ["اكل الكلب", "نوع الطعام", "وجبات", "عندي اكل خاص", "حساسية طعام", "الاكل"],
        responses: ["نحن نهتم جداً بتغذية أليفك! نقدم وجبات متوازنة، وإذا كان كلبك يتبع نظاماً خاصاً يمكنك تزويدنا بطعامه وسنلتزم بجدوله بدقة."],
        suggestions: ["الباقات", "الأسعار", "شروط الاستقبال"]
    },
    medical: {
        keywords: ["حالة طوارئ", "طبيب بيطري", "مرض الكلب", "تعبان", "دكتور", "علاج"],
        responses: ["سلامة أليفك أولويتنا. لدينا تعاقد مع عيادة بيطرية 24 ساعة، وفي حالات الطوارئ نتخذ الإجراءات فوراً ونتصل بك."],
        suggestions: ["شروط الاستقبال", "تواصل معنا"]
    },
    requirements: {
        keywords: ["شروط الاستقبال", "تطعيمات", "دفتر الصحة", "عمر الكلب"],
        responses: ["نستقبل الكلاب المطعمة بالكامل والخالية من الأمراض المعدية لضمان سلامة الجميع. يرجى إحضار دفتر التطعيمات."],
        suggestions: ["الباقات", "موقع الفندق"]
    },
    updates: {
        keywords: ["صور كلبي", "فيديو", "اطمن عليه", "كاميرا", "اخبار الكلب", "تحديثات"],
        responses: ["نحن نقدر تماماً قلقك! 📸 نرسل لك تحديثات يومية تشمل صوراً ومقاطع فيديو لأليفك وهو يلعب، كما يمكنك طلب مكالمة فيديو في أوقات محددة لرؤيته بنفسك."],
        suggestions: ["طريقة التواصل", "الباقات"]
    },
    belongings: {
        keywords: ["ايش اجيب معي", "اغراض الكلب", "سرير الكلب", "تجهيزات", "شنطة الكلب"],
        responses: ["كل ما يحتاجه الكلب متوفر! لكن ننصح بإحضار لعبته المفضلة أو بطانية من المنزل لمساعدته على الاستقرار، ولا تنسَ دفتر التطعيمات."],
        suggestions: ["شروط الاستقبال", "طريقة الحجز"]
    },
    offers: {
        keywords: ["خصم", "عرض", "عرض خاص", "سعر ارخص", "كلبين", "مدة طويلة"],
        responses: ["🎁 لدينا عروض رائعة! نقدم خصماً 15% للإقامات التي تزيد عن أسبوع، وخصماً خاصاً عند إحضار أكثر من أليف. تواصل معنا لتفاصيل أكثر!"],
        suggestions: ["تواصل معنا", "الأسعار", "الحزمة الخاصة"]
    },
    JSON: {
        keywords: ["مرحبا", "شلونك", "كيف حالك", "هلا", "اهلين", "السلام عليكم"],
        responses: ["اهلا بك بموقع Loving Homes! كيف يمكنني مساعدتك اليوم؟ 😊"],
        suggestions: ["الباقات", "الأسعار", "طريقة الحجز", "التواصل"],
    },
    history: {
        keywords: ["تاريخ الفندق", "من انتم", "قصة الفندق", "كيف بدأتم"],
        responses: ["فندق Loving Homes تأسس في عام 2010 على يد مجموعة من محبي الحيوانات الذين أرادوا توفير مكان آمن ومريح لأليفهم أثناء غيابهم. بدأنا بغرفة صغيرة في منزل أحد المؤسسين، ومع مرور الوقت توسعنا لنصبح واحداً من أفضل فنادق الحيوانات الأليفة في المنطقة، ملتزمين بتقديم رعاية عالية الجودة وخدمة مميزة لكلبك العزيز."],
        suggestions: ["الباقات", "الأسعار", "موقع الفندق"]
    },
    Offers: {
        keywords: ["عرض", "خصم", "تخفيض", "عرض خاص", "سعر ارخص"],
        responses: ["🎁 لدينا عروض رائعة! نقدم خصماً 15% للإقامات التي تزيد عن أسبوع، وخصماً خاصاً عند إحضار أكثر من أليف. تواصل معنا لتفاصيل أكثر!"],
        suggestions: ["تواصل معنا", "الأسعار", "الحزمة الخاصة"]
    },
    length_of_stay: {
        keywords: ["مدة الإقامة", "كم يوم", "مدة البقاء", "المدة"],
        responses: ["يمكنك حجز إقامتك لمدة يوم واحد أو أكثر حسب احتياجاتك. كلما زادت مدة الإقامة، زادت الراحة والتجربة المميزة لأليفك!"],
        suggestions: ["الباقات", "الأسعار", "طريقة الحجز"]
    },
    navigator: {
        keywords: ["كيف اصل لكم", "كيفية الوصول", "الاتجاهات", "الوصول"],
        responses: ["📍 للوصول إلى فندق Loving Homes، يمكنك اتباع الاتجاهات التالية:\n\n1️⃣ من وسط المدينة: اتجه جنوباً على شارع الرفق، ثم انعطف يميناً عند إشارة المرور الأولى. الفندق سيكون على الجانب الأيسر بعد 200 متر.\n\n2️⃣ من الطريق السريع: خذ مخرج 5 نحو شارع الرفق، ثم اتجه شمالاً لمدة 3 كيلومترات. الفندق سيكون على الجانب الأيمن.\n\nإذا كنت تستخدم GPS، فقط أدخل العنوان التالي: شارع الرفق، حي الكلاب السعيدة، المدينة."],
        suggestions: ["موقع الفندق", "طريقة الحجز", "الباقات"]
    },
    zoo: {
        keywords: ["هل لديكم حيوانات أخرى", "حيوانات أخرى", "حيوانات في الفندق"],
        responses: ["فندق Loving Homes متخصص في رعاية الكلاب فقط لضمان تقديم أفضل خدمة ورعاية لأليفك. نحن نركز على توفير بيئة مريحة وآمنة للكلاب، ونعتذر لعدم استقبال أنواع أخرى من الحيوانات الأليفة."],
        suggestions: ["الباقات", "الأسعار", "موقع الفندق"]
    },
    setMinDate: {
        keywords: ["تاريخ الحجز", "تاريخ اليوم", "تاريخ الحجز لا يقل عن اليوم"],
        responses: ["تم ضبط تاريخ الحجز ليكون لا يقل عن اليوم لضمان حجزك بشكل صحيح."],
        suggestions: ["طريقة الحجز", "الباقات", "الأسعار"]
    },
    calculateTotal: {
        keywords: ["احسب التكلفة", "كم التكلفة", "احسب السعر"],
        responses: ["لحساب التكلفة الإجمالية، يرجى اختيار نوع الحزمة وعدد الأيام في صفحة الحجز، وستظهر لك التكلفة الإجمالية تلقائياً."],
        suggestions: ["طريقة الحجز", "الباقات", "الأسعار"]
    },
    onabort: {
        keywords: ["إلغاء الحجز", "أريد إلغاء الحجز", "كيف ألغي الحجز"],
        responses: ["لإلغاء حجزك، يرجى التواصل معنا عبر الهاتف أو البريد الإلكتروني مع ذكر اسمك وتاريخ الحجز، وسنقوم بمساعدتك في عملية الإلغاء."],
        suggestions: ["تواصل معنا", "طريقة الحجز", "الأسعار"]
    },
    yield: {
        keywords: ["متى يكون الحجز متاح", "متى يمكنني الحجز", "متى أستطيع الحجز"],
        responses: ["الحجز متاح على مدار الساعة طوال أيام الأسبوع! يمكنك حجز إقامتك في أي وقت يناسبك من خلال صفحة الحجز على موقعنا."],
        suggestions: ["طريقة الحجز", "الباقات", "الأسعار"]
    },
    resetForm: {
        keywords: ["إعادة تعيين النموذج", "أريد إعادة تعيين النموذج", "كيف أعيد تعيين النموذج"],
        responses: ["لإعادة تعيين نموذج الحجز، يمكنك النقر على زر 'مسح البيانات' في صفحة الحجز، وسيتم مسح جميع الحقول وإعادة ضبطها إلى القيم الافتراضية."],
        suggestions: ["طريقة الحجز", "الباقات", "الأسعار"]
    },
    break: {
        keywords: ["توقف", "أريد التوقف", "كيف أتوقف"],
        responses: ["إذا كنت ترغب في التوقف عن استخدام خدماتنا أو لديك أي استفسار حول ذلك، يرجى التواصل معنا عبر الهاتف أو البريد الإلكتروني، وسنكون سعداء بمساعدتك في أي استفسار أو إجراء تود القيام به."],
        suggestions: ["تواصل معنا", "طريقة الحجز", "الأسعار"]
    },
    scrollY: {
        keywords: ["كيف أتمكن من رؤية المزيد", "أريد رؤية المزيد", "كيف أتمكن من التمرير"],
        responses: ["لرؤية المزيد من الرسائل في المحادثة، يمكنك استخدام عجلة الفأرة أو شريط التمرير الجانبي في نافذة المحادثة للتمرير لأعلى ولأسفل."],
        suggestions: ["طريقة الحجز", "الباقات", "الأسعار"]
    },
    
    
    
};



function normalizeArabic(text) {
    if (!text) return "";
    return text.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/[؟?!.,]/g, "").trim(); 
}

function detectIntent(text) {
    let normalizedInput = normalizeArabic(text);
   
    for (let intent in intentsDB) {
        for (let word of intentsDB[intent].keywords) {
            if (normalizedInput.includes(normalizeArabic(word))) return intent;
        }
    }
    return "unknown";
}

function addBotMessage(text, suggestions = []) {
    const chatBody = document.getElementById("chat-body");
    const bubble = document.createElement("div");
    bubble.style = "text-align:right;margin-bottom:10px;";
    bubble.innerHTML = `<span style="background:#eef2f5;color:#333;padding:10px;border-radius:10px;display:inline-block;border-right:3px solid #FF8C00;white-space:pre-line; max-width: 80%; font-size: 14px; line-height: 1.5;">🤖 <span class="bot-text"></span></span>`;
    chatBody.appendChild(bubble);
    
    const botTextElement = bubble.querySelector(".bot-text");
    let i = 0;
    function type() {
        if (i < text.length) {
            botTextElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 15);
        } else if (suggestions.length > 0) {
            addSuggestions(suggestions);
        }
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    type();
}

function addSuggestions(list) {
    const chatBody = document.getElementById("chat-body");
    const sugContainer = document.createElement("div");
    sugContainer.style = "margin:10px 0;text-align:center; display: flex; flex-wrap: wrap; justify-content: center;";
    list.forEach(item => {
        const btn = document.createElement("button");
        btn.innerText = item;
        btn.style = "margin:3px;padding:6px 12px;border-radius:20px;border:1px solid #FF8C00;color:#FF8C00;cursor:pointer;background:white;font-size:12px;transition:0.3s;";
        btn.onmouseover = () => { btn.style.background = "#FF8C00"; btn.style.color = "white"; };
        btn.onmouseout = () => { btn.style.background = "white"; btn.style.color = "#FF8C00"; };
        btn.onclick = () => {
            document.getElementById("user-input").value = item;
            aiResponse();
        };
        sugContainer.appendChild(btn);
    });
    chatBody.appendChild(sugContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function aiResponse() {
    const inputField = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");
    const input = inputField.value.trim();
    if (input === "") return;

    chatBody.innerHTML += `<div style="text-align:left;margin-bottom:10px;"><span style="background:#FF8C00;color:white;padding:8px 15px;border-radius:10px;display:inline-block; font-size: 14px;">${input}</span></div>`;
    
    const intent = detectIntent(input);
    inputField.value = "";

    setTimeout(() => {
        if (intent === "unknown") {
            addBotMessage("🤔 عذراً، لم أفهم طلبك تماماً. هل تقصد الاستفسار عن الأسعار أو طريقة الحجز؟", ["الباقات", "الأسعار", "طريقة الحجز"]);
        } else {
            const data = intentsDB[intent];
            addBotMessage(data.responses[0], data.suggestions);
        }
    }, 400);
}

function toggleChat() {
    const chatWindow = document.getElementById("ai-chat-window");
    if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
        chatWindow.style.display = "block";
        if (document.getElementById("chat-body").innerHTML.trim() === "") {
            setTimeout(() => {
                addBotMessage("🐾 أهلاً بك في فندق Loving Homes! أنا هنا لمساعدتك. اختر أحد الأسئلة الشائعة أو اكتب سؤالك بالأسفل:", ["الباقات", "الأسعار", "طريقة الحجز", "التواصل"]);
            }, 300);
        }
    } else {
        chatWindow.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("user-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") aiResponse();
    });
});