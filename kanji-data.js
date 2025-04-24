// Kanji database with meanings and metadata
const kanjiDatabase = [
    {
        kanji: '愛',
        meanings: ['love', 'affection', 'care', 'attachment'],
        pronunciation: 'ai',
        commonUsage: 'Love (愛情 ai-jō), deep affection',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '平',
        meanings: ['peace', 'flat', 'calm', 'even'],
        pronunciation: 'hei, taira',
        commonUsage: 'Peace (平和 hei-wa), balance',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '幸',
        meanings: ['happiness', 'luck', 'fortune', 'blessing'],
        pronunciation: 'kō, sachi',
        commonUsage: 'Happiness (幸福 kō-fuku), good fortune',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '強',
        meanings: ['strong', 'strength', 'power', 'might', 'force'],
        pronunciation: 'kyō, tsuyoi',
        commonUsage: 'Strength (強さ tsuyo-sa), power',
        negativeConnotations: {
            exists: true,
            meanings: ['forceful', 'coercion', 'overpowering']
        }
    },
    {
        kanji: '美',
        meanings: ['beauty', 'beautiful', 'aesthetic'],
        pronunciation: 'bi',
        commonUsage: 'Beauty (美しい utsu-kushii), aesthetic',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '勇',
        meanings: ['courage', 'bravery', 'heroism', 'valor'],
        pronunciation: 'yū',
        commonUsage: 'Courage (勇気 yū-ki), bravery',
        negativeConnotations: {
            exists: true,
            meanings: ['recklessness', 'rashness']
        }
    },
    {
        kanji: '忍',
        meanings: ['endurance', 'patience', 'perseverance', 'stealth'],
        pronunciation: 'nin, shinobu',
        commonUsage: 'Patience (忍耐 nin-tai), endurance',
        negativeConnotations: {
            exists: true,
            meanings: ['concealment', 'secrecy', 'espionage']
        }
    },
    {
        kanji: '信',
        meanings: ['trust', 'faith', 'belief', 'confidence'],
        pronunciation: 'shin',
        commonUsage: 'Trust (信頼 shin-rai), faith',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '希',
        meanings: ['hope', 'wish', 'desire', 'aspiration'],
        pronunciation: 'ki',
        commonUsage: 'Hope (希望 ki-bō), desire',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '夢',
        meanings: ['dream', 'vision', 'aspiration'],
        pronunciation: 'mu, yume',
        commonUsage: 'Dream (夢想 mu-sō), vision',
        negativeConnotations: {
            exists: true,
            meanings: ['fantasy', 'delusion', 'impractical']
        }
    },
    {
        kanji: '智',
        meanings: ['wisdom', 'intellect', 'intelligence', 'knowledge'],
        pronunciation: 'chi',
        commonUsage: 'Wisdom (智恵 chi-e), intelligence',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '和',
        meanings: ['harmony', 'peace', 'balance', 'reconciliation'],
        pronunciation: 'wa',
        commonUsage: 'Harmony (和合 wa-gō), peace',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '静',
        meanings: ['quiet', 'calm', 'serenity', 'tranquility'],
        pronunciation: 'sei, shizuka',
        commonUsage: 'Calm (静か shizu-ka), tranquility',
        negativeConnotations: {
            exists: true,
            meanings: ['inactivity', 'standstill', 'lifelessness']
        }
    },
    {
        kanji: '誠',
        meanings: ['sincerity', 'honesty', 'integrity', 'truth'],
        pronunciation: 'sei, makoto',
        commonUsage: 'Sincerity (誠実 sei-jitsu), integrity',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '命',
        meanings: ['life', 'destiny', 'fate', 'existence'],
        pronunciation: 'mei, inochi',
        commonUsage: 'Life (命令 mei-rei), destiny',
        negativeConnotations: {
            exists: true,
            meanings: ['command', 'order', 'decree']
        }
    },
    {
        kanji: '光',
        meanings: ['light', 'shine', 'ray', 'gleam'],
        pronunciation: 'kō, hikari',
        commonUsage: 'Light (光明 kō-myō), brilliance',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '道',
        meanings: ['way', 'path', 'road', 'journey', 'philosophy'],
        pronunciation: 'dō, michi',
        commonUsage: 'Way/Path (道路 dō-ro), philosophy',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '永',
        meanings: ['eternity', 'forever', 'perpetual', 'everlasting'],
        pronunciation: 'ei',
        commonUsage: 'Eternity (永遠 ei-en), forever',
        negativeConnotations: {
            exists: true,
            meanings: ['tedious', 'endless', 'interminable']
        }
    },
    {
        kanji: '恋',
        meanings: ['romance', 'love', 'affection', 'passion'],
        pronunciation: 'ren, koi',
        commonUsage: 'Romantic love (恋愛 ren-ai), passion',
        negativeConnotations: {
            exists: true,
            meanings: ['yearning', 'longing', 'unrequited love']
        }
    },
    {
        kanji: '友',
        meanings: ['friend', 'friendship', 'companion'],
        pronunciation: 'yū',
        commonUsage: 'Friend (友達 tomo-dachi), friendship',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '力',
        meanings: ['power', 'strength', 'ability', 'force'],
        pronunciation: 'ryoku, chikara',
        commonUsage: 'Power (力量 riki-ryō), strength',
        negativeConnotations: {
            exists: true,
            meanings: ['pressure', 'stress', 'strain']
        }
    },
    {
        kanji: '心',
        meanings: ['heart', 'mind', 'spirit', 'soul'],
        pronunciation: 'shin, kokoro',
        commonUsage: 'Heart/Mind (心理 shin-ri), spirit',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '自',
        meanings: ['self', 'oneself', 'personal', 'individuality'],
        pronunciation: 'ji, mizuka',
        commonUsage: 'Self (自分 ji-bun), individual',
        negativeConnotations: {
            exists: true,
            meanings: ['selfish', 'egotistic', 'self-centered']
        }
    },
    {
        kanji: '生',
        meanings: ['life', 'birth', 'growth', 'raw'],
        pronunciation: 'sei, nama',
        commonUsage: 'Life (生命 sei-mei), birth',
        negativeConnotations: {
            exists: true,
            meanings: ['inexperienced', 'naive', 'uncooked']
        }
    },
    {
        kanji: '家',
        meanings: ['home', 'family', 'house', 'household'],
        pronunciation: 'ka, ie',
        commonUsage: 'Home/Family (家族 ka-zoku), household',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '龍',
        meanings: ['dragon', 'imperial', 'mythical'],
        pronunciation: 'ryū',
        commonUsage: 'Dragon (龍神 ryū-jin), mythical beast',
        negativeConnotations: {
            exists: true,
            meanings: ['fierce', 'threatening', 'monstrous']
        }
    },
    {
        kanji: '健',
        meanings: ['health', 'healthy', 'fitness', 'vigor'],
        pronunciation: 'ken',
        commonUsage: 'Health (健康 ken-kō), wellness',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '真',
        meanings: ['truth', 'reality', 'genuine', 'authentic'],
        pronunciation: 'shin, ma',
        commonUsage: 'Truth (真実 shin-jitsu), reality',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '飛',
        meanings: ['fly', 'soar', 'flight', 'leap'],
        pronunciation: 'hi, tobu',
        commonUsage: 'Fly (飛行 hi-kō), soaring',
        negativeConnotations: {
            exists: true,
            meanings: ['scattered', 'fleeing', 'escaping']
        }
    },
    {
        kanji: '火',
        meanings: ['fire', 'flame', 'blaze', 'passion'],
        pronunciation: 'ka, hi',
        commonUsage: 'Fire (火事 ka-ji), flame',
        negativeConnotations: {
            exists: true,
            meanings: ['destruction', 'rage', 'disaster']
        }
    },
    {
        kanji: '水',
        meanings: ['water', 'fluid', 'liquid', 'aqua'],
        pronunciation: 'sui, mizu',
        commonUsage: 'Water (水分 sui-bun), liquid',
        negativeConnotations: {
            exists: true,
            meanings: ['flood', 'watery', 'diluted']
        }
    },
    {
        kanji: '危',
        meanings: ['danger', 'risk', 'hazard', 'peril'],
        pronunciation: 'ki',
        commonUsage: 'Danger/Risk (危険 ki-ken)',
        negativeConnotations: {
            exists: true,
            meanings: ['critical', 'precarious', 'unstable']
        }
    },
    {
        kanji: '戦',
        meanings: ['war', 'battle', 'fight', 'conflict'],
        pronunciation: 'sen, ikusa',
        commonUsage: 'War/Battle (戦争 sen-sō)',
        negativeConnotations: {
            exists: true,
            meanings: ['violence', 'hostility', 'aggression']
        }
    },
    {
        kanji: '勝',
        meanings: ['victory', 'win', 'prevail', 'triumph'],
        pronunciation: 'shō, katsu',
        commonUsage: 'Victory/Win (勝利 shō-ri)',
        negativeConnotations: {
            exists: true,
            meanings: ['defeat others', 'domination', 'superiority']
        }
    },
    {
        kanji: '英',
        meanings: ['hero', 'distinguished', 'excellence', 'outstanding'],
        pronunciation: 'ei',
        commonUsage: 'Hero/Excellence (英雄 ei-yū)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '謙',
        meanings: ['modesty', 'humility', 'humble'],
        pronunciation: 'ken',
        commonUsage: 'Humility (謙虚 ken-kyo)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '冒',
        meanings: ['risk', 'venture', 'dare', 'brave'],
        pronunciation: 'bō',
        commonUsage: 'Risk/Brave attempt (冒険 bō-ken)',
        negativeConnotations: {
            exists: true,
            meanings: ['reckless', 'risky', 'endangering']
        }
    },
    {
        kanji: '創',
        meanings: ['create', 'creativity', 'innovation', 'establish'],
        pronunciation: 'sō',
        commonUsage: 'Creation (創造 sō-zō)',
        negativeConnotations: {
            exists: true,
            meanings: ['wound', 'injury', 'hurt']
        }
    },
    {
        kanji: '翔',
        meanings: ['soar', 'fly high', 'glide', 'excel'],
        pronunciation: 'shō',
        commonUsage: 'Soaring (飛翔 hi-shō)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '武',
        meanings: ['warrior', 'military', 'martial', 'chivalry'],
        pronunciation: 'bu, mu',
        commonUsage: 'Martial/Military (武道 bu-dō)',
        negativeConnotations: {
            exists: true,
            meanings: ['violence', 'combat', 'warfare']
        }
    },
    {
        kanji: '守',
        meanings: ['protect', 'guard', 'defend', 'keep'],
        pronunciation: 'shu, mamoru',
        commonUsage: 'Protection (守護 shu-go)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '傑',
        meanings: ['outstanding', 'excellence', 'genius', 'masterpiece'],
        pronunciation: 'ketsu',
        commonUsage: 'Outstanding person (傑出 ketsu-shutsu)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '賢',
        meanings: ['wisdom', 'intelligent', 'clever', 'wise'],
        pronunciation: 'ken, kashikoi',
        commonUsage: 'Wisdom/Intelligence (賢明 ken-mei)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '徳',
        meanings: ['virtue', 'morality', 'goodness', 'ethics'],
        pronunciation: 'toku',
        commonUsage: 'Virtue (徳行 toku-kō)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '絆',
        meanings: ['bond', 'connection', 'tie', 'relationship'],
        pronunciation: 'kizuna',
        commonUsage: 'Bond/Connection (絆)',
        negativeConnotations: {
            exists: true,
            meanings: ['restraint', 'tether', 'binding']
        }
    },
    {
        kanji: '魂',
        meanings: ['soul', 'spirit', 'ghost', 'essence'],
        pronunciation: 'kon, tamashii',
        commonUsage: 'Soul/Spirit (魂)',
        negativeConnotations: {
            exists: true,
            meanings: ['apparition', 'specter', 'haunting']
        }
    },
    {
        kanji: '夜',
        meanings: ['night', 'evening', 'darkness'],
        pronunciation: 'ya, yoru',
        commonUsage: 'Night (夜間 ya-kan)',
        negativeConnotations: {
            exists: true,
            meanings: ['obscurity', 'murky', 'hidden']
        }
    },
    {
        kanji: '星',
        meanings: ['star', 'celestial', 'astral'],
        pronunciation: 'sei, hoshi',
        commonUsage: 'Star (星空 hoshi-zora)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '空',
        meanings: ['sky', 'air', 'void', 'emptiness'],
        pronunciation: 'kū, sora',
        commonUsage: 'Sky (空気 kū-ki)',
        negativeConnotations: {
            exists: true,
            meanings: ['emptiness', 'hollow', 'vacant']
        }
    },
    {
        kanji: '風',
        meanings: ['wind', 'breeze', 'style', 'manner'],
        pronunciation: 'fū, kaze',
        commonUsage: 'Wind (風向 kaze-mukai)',
        negativeConnotations: {
            exists: true,
            meanings: ['gale', 'storm', 'turbulence']
        }
    },
    {
        kanji: '雨',
        meanings: ['rain', 'precipitation', 'shower'],
        pronunciation: 'u, ame',
        commonUsage: 'Rain (雨天 u-ten)',
        negativeConnotations: {
            exists: true,
            meanings: ['downpour', 'storm', 'dreariness']
        }
    },
    {
        kanji: '雷',
        meanings: ['thunder', 'lightning', 'bolt'],
        pronunciation: 'rai, kaminari',
        commonUsage: 'Thunder/Lightning (雷光 rai-kō)',
        negativeConnotations: {
            exists: true,
            meanings: ['shock', 'terror', 'sudden disaster']
        }
    },
    {
        kanji: '激',
        meanings: ['intense', 'violent', 'extreme', 'fierce'],
        pronunciation: 'geki',
        commonUsage: 'Intense (激しい hage-shii)',
        negativeConnotations: {
            exists: true,
            meanings: ['rage', 'vehemence', 'aggression']
        }
    },
    {
        kanji: '悪',
        meanings: ['evil', 'bad', 'wrong', 'wickedness'],
        pronunciation: 'aku, warui',
        commonUsage: 'Evil/Wickedness (悪魔 aku-ma)',
        negativeConnotations: {
            exists: true,
            meanings: ['malice', 'wickedness', 'harm']
        }
    },
    {
        kanji: '善',
        meanings: ['good', 'virtue', 'goodness', 'right'],
        pronunciation: 'zen, yoi',
        commonUsage: 'Goodness (善良 zen-ryō)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '正',
        meanings: ['correct', 'justice', 'righteous', 'proper'],
        pronunciation: 'sei, tadashii',
        commonUsage: 'Correct/Justice (正義 sei-gi)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '神',
        meanings: ['god', 'deity', 'divine', 'spiritual'],
        pronunciation: 'shin, kami',
        commonUsage: 'God/Divine (神聖 shin-sei)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '鬼',
        meanings: ['demon', 'ogre', 'devil', 'ghost'],
        pronunciation: 'ki, oni',
        commonUsage: 'Demon/Devil (鬼神 ki-jin)',
        negativeConnotations: {
            exists: true,
            meanings: ['terrifying', 'demonic', 'evil spirit']
        }
    },
    {
        kanji: '天',
        meanings: ['heaven', 'sky', 'celestial', 'imperial'],
        pronunciation: 'ten, ame',
        commonUsage: 'Heaven/Sky (天国 ten-goku)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '地',
        meanings: ['earth', 'ground', 'land', 'soil'],
        pronunciation: 'chi, ji',
        commonUsage: 'Earth/Land (地球 chi-kyū)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '海',
        meanings: ['sea', 'ocean', 'marine'],
        pronunciation: 'kai, umi',
        commonUsage: 'Sea/Ocean (海洋 kai-yō)',
        negativeConnotations: {
            exists: true,
            meanings: ['vast', 'overwhelming', 'drowning']
        }
    },
    {
        kanji: '山',
        meanings: ['mountain', 'hill', 'peak'],
        pronunciation: 'san, yama',
        commonUsage: 'Mountain (山岳 san-gaku)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '森',
        meanings: ['forest', 'woods', 'woodland'],
        pronunciation: 'shin, mori',
        commonUsage: 'Forest (森林 shin-rin)',
        negativeConnotations: {
            exists: true,
            meanings: ['wild', 'untamed', 'mysterious']
        }
    },
    {
        kanji: '月',
        meanings: ['moon', 'month', 'lunar'],
        pronunciation: 'getsu, tsuki',
        commonUsage: 'Moon (月光 getsu-kō)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '日',
        meanings: ['sun', 'day', 'solar'],
        pronunciation: 'nichi, hi',
        commonUsage: 'Sun/Day (日光 nikkō)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '時',
        meanings: ['time', 'hour', 'moment', 'occasion'],
        pronunciation: 'ji, toki',
        commonUsage: 'Time (時間 ji-kan)',
        negativeConnotations: {
            exists: true,
            meanings: ['fleeting', 'temporary', 'transient']
        }
    },
    {
        kanji: '花',
        meanings: ['flower', 'blossom', 'bloom', 'beauty'],
        pronunciation: 'ka, hana',
        commonUsage: 'Flower (花束 hana-taba)',
        negativeConnotations: {
            exists: true,
            meanings: ['temporary', 'fleeting beauty', 'wilting']
        }
    },
    {
        kanji: '笑',
        meanings: ['laugh', 'smile', 'happy', 'cheerful'],
        pronunciation: 'shō, warau',
        commonUsage: 'Laugh/Smile (笑顔 egao)',
        negativeConnotations: {
            exists: true,
            meanings: ['mockery', 'ridicule', 'scorn']
        }
    },
    {
        kanji: '涙',
        meanings: ['tear', 'teardrop', 'emotion'],
        pronunciation: 'rui, namida',
        commonUsage: 'Tears (涙腺 rui-sen)',
        negativeConnotations: {
            exists: true,
            meanings: ['sorrow', 'grief', 'crying']
        }
    },
    {
        kanji: '怒',
        meanings: ['anger', 'rage', 'fury', 'wrath'],
        pronunciation: 'do, ikari',
        commonUsage: 'Anger (怒り ikari)',
        negativeConnotations: {
            exists: true,
            meanings: ['violence', 'rage', 'hostility']
        }
    },
    {
        kanji: '喜',
        meanings: ['joy', 'delight', 'pleasure', 'happiness'],
        pronunciation: 'ki, yorokobi',
        commonUsage: 'Joy (喜び yorokobi)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '哀',
        meanings: ['sorrow', 'grief', 'sadness', 'misery'],
        pronunciation: 'ai, kanashimi',
        commonUsage: 'Sorrow (哀愁 ai-shū)',
        negativeConnotations: {
            exists: true,
            meanings: ['despair', 'misery', 'distress']
        }
    },
    {
        kanji: '楽',
        meanings: ['comfort', 'ease', 'pleasure', 'enjoyment'],
        pronunciation: 'raku, tanoshii',
        commonUsage: 'Enjoyment (楽しい tanoshii)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '金',
        meanings: ['gold', 'metal', 'money', 'wealth'],
        pronunciation: 'kin, kane',
        commonUsage: 'Gold/Money (金銭 kin-sen)',
        negativeConnotations: {
            exists: true,
            meanings: ['greed', 'materialism', 'wealth obsession']
        }
    },
    {
        kanji: '銀',
        meanings: ['silver', 'money', 'precious metal'],
        pronunciation: 'gin',
        commonUsage: 'Silver (銀色 gin-iro)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '剣',
        meanings: ['sword', 'blade', 'saber'],
        pronunciation: 'ken, tsurugi',
        commonUsage: 'Sword (剣道 ken-dō)',
        negativeConnotations: {
            exists: true,
            meanings: ['weapon', 'violence', 'killing']
        }
    },
    {
        kanji: '闇',
        meanings: ['darkness', 'obscurity', 'gloom', 'shadow'],
        pronunciation: 'yami',
        commonUsage: 'Darkness (闇夜 yami-yo)',
        negativeConnotations: {
            exists: true,
            meanings: ['evil', 'secrecy', 'corruption']
        }
    },
    {
        kanji: '響',
        meanings: ['echo', 'resonance', 'reverberation', 'sound'],
        pronunciation: 'kyō, hibiki',
        commonUsage: 'Echo/Resonance (響き hibiki)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '謎',
        meanings: ['mystery', 'enigma', 'puzzle', 'riddle'],
        pronunciation: 'mei, nazo',
        commonUsage: 'Mystery/Enigma (謎)',
        negativeConnotations: {
            exists: true,
            meanings: ['secrecy', 'unknown', 'confusion']
        }
    },
    {
        kanji: '翼',
        meanings: ['wing', 'feather', 'flight'],
        pronunciation: 'yoku, tsubasa',
        commonUsage: 'Wing (翼)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '刃',
        meanings: ['blade', 'edge', 'sword', 'cutting'],
        pronunciation: 'jin, ha',
        commonUsage: 'Blade/Edge (刃物 ha-mono)',
        negativeConnotations: {
            exists: true,
            meanings: ['sharpness', 'danger', 'weapon']
        }
    },
    {
        kanji: '瞬',
        meanings: ['moment', 'instant', 'blink', 'flash'],
        pronunciation: 'shun, matataki',
        commonUsage: 'Moment/Instant (瞬間 shun-kan)',
        negativeConnotations: {
            exists: true,
            meanings: ['ephemeral', 'fleeting', 'impermanent']
        }
    },
    {
        kanji: '毒',
        meanings: ['poison', 'venom', 'toxin', 'harmful'],
        pronunciation: 'doku',
        commonUsage: 'Poison/Venom (毒物 doku-butsu)',
        negativeConnotations: {
            exists: true,
            meanings: ['harmful', 'toxic', 'deadly']
        }
    },
    {
        kanji: '薬',
        meanings: ['medicine', 'drug', 'remedy', 'cure'],
        pronunciation: 'yaku, kusuri',
        commonUsage: 'Medicine (薬物 yaku-butsu)',
        negativeConnotations: {
            exists: true,
            meanings: ['drug', 'dependency', 'chemicals']
        }
    },
    {
        kanji: '災',
        meanings: ['disaster', 'calamity', 'misfortune'],
        pronunciation: 'sai',
        commonUsage: 'Disaster (災害 sai-gai)',
        negativeConnotations: {
            exists: true,
            meanings: ['catastrophe', 'ruin', 'destruction']
        }
    },
    {
        kanji: '変',
        meanings: ['change', 'transform', 'unusual', 'strange'],
        pronunciation: 'hen, kawaru',
        commonUsage: 'Change/Transform (変化 hen-ka)',
        negativeConnotations: {
            exists: true,
            meanings: ['weird', 'abnormal', 'bizarre']
        }
    },
    {
        kanji: '成',
        meanings: ['become', 'achieve', 'accomplish', 'complete'],
        pronunciation: 'sei, naru',
        commonUsage: 'Accomplish (成功 sei-kō)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '壊',
        meanings: ['break', 'destroy', 'demolish', 'collapse'],
        pronunciation: 'kai, kowasu',
        commonUsage: 'Destroy (破壊 ha-kai)',
        negativeConnotations: {
            exists: true,
            meanings: ['destruction', 'ruin', 'damage']
        }
    },
    {
        kanji: '優',
        meanings: ['superior', 'gentle', 'kind', 'excellent'],
        pronunciation: 'yū, yasashii',
        commonUsage: 'Gentle/Kind (優しい yasashii)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '熱',
        meanings: ['heat', 'passion', 'fever', 'enthusiasm'],
        pronunciation: 'netsu, atsui',
        commonUsage: 'Heat/Passion (熱意 netsu-i)',
        negativeConnotations: {
            exists: true,
            meanings: ['burning', 'feverish', 'overzealous']
        }
    },
    {
        kanji: '冷',
        meanings: ['cold', 'cool', 'chill', 'freezing'],
        pronunciation: 'rei, tsumetai',
        commonUsage: 'Cold (冷静 rei-sei)',
        negativeConnotations: {
            exists: true,
            meanings: ['frigid', 'heartless', 'indifferent']
        }
    },
    {
        kanji: '静',
        meanings: ['quiet', 'calm', 'peaceful', 'still'],
        pronunciation: 'sei, shizuka',
        commonUsage: 'Calm/Quiet (静か shizu-ka)',
        negativeConnotations: {
            exists: true,
            meanings: ['dull', 'inactive', 'lifeless']
        }
    },
    {
        kanji: '霊',
        meanings: ['spirit', 'soul', 'ghost', 'supernatural'],
        pronunciation: 'rei, tama',
        commonUsage: 'Spirit (霊魂 rei-kon)',
        negativeConnotations: {
            exists: true,
            meanings: ['haunting', 'eerie', 'spooky']
        }
    },
    {
        kanji: '響',
        meanings: ['echo', 'resound', 'reverberate', 'influence'],
        pronunciation: 'kyō, hibiki',
        commonUsage: 'Echo/Resound (響き hibiki)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '運',
        meanings: ['fortune', 'luck', 'destiny', 'transport'],
        pronunciation: 'un',
        commonUsage: 'Luck/Fortune (運命 un-mei)',
        negativeConnotations: {
            exists: true,
            meanings: ['fate', 'predestined', 'uncontrollable']
        }
    },
    {
        kanji: '助',
        meanings: ['help', 'aid', 'assist', 'rescue'],
        pronunciation: 'jo, tasukeru',
        commonUsage: 'Help/Assistance (助ける tasu-keru)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '栄',
        meanings: ['glory', 'prosperity', 'flourish', 'honor'],
        pronunciation: 'ei, sakae',
        commonUsage: 'Glory/Honor (栄光 ei-kō)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '凍',
        meanings: ['freeze', 'frozen', 'ice', 'congeal'],
        pronunciation: 'tō, kooru',
        commonUsage: 'Freeze (凍結 tō-ketsu)',
        negativeConnotations: {
            exists: true,
            meanings: ['numbing', 'immobilized', 'stagnant']
        }
    },
    {
        kanji: '粋',
        meanings: ['elegance', 'purity', 'essence', 'stylish'],
        pronunciation: 'sui, iki',
        commonUsage: 'Elegance/Style (粋)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '鋭',
        meanings: ['sharp', 'pointed', 'acute', 'keen'],
        pronunciation: 'ei, surudoi',
        commonUsage: 'Sharp/Keen (鋭い suru-doi)',
        negativeConnotations: {
            exists: true,
            meanings: ['piercing', 'cutting', 'harsh']
        }
    },
    {
        kanji: '無',
        meanings: ['nothing', 'none', 'nothingness', 'void'],
        pronunciation: 'mu, nai',
        commonUsage: 'Nothingness (無限 mu-gen)',
        negativeConnotations: {
            exists: true,
            meanings: ['absence', 'lack', 'emptiness']
        }
    },
    {
        kanji: '有',
        meanings: ['exist', 'possess', 'have', 'being'],
        pronunciation: 'yū, aru',
        commonUsage: 'Exist/Possess (有名 yū-mei)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '奇',
        meanings: ['strange', 'unusual', 'rare', 'wonderful'],
        pronunciation: 'ki',
        commonUsage: 'Strange/Unusual (奇妙 ki-myō)',
        negativeConnotations: {
            exists: true,
            meanings: ['bizarre', 'abnormal', 'weird']
        }
    },
    {
        kanji: '綺',
        meanings: ['beautiful', 'splendid', 'gorgeous', 'magnificent'],
        pronunciation: 'ki',
        commonUsage: 'Beautiful/Splendid (綺麗 ki-rei)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '極',
        meanings: ['extreme', 'pole', 'culmination', 'highest'],
        pronunciation: 'kyoku, kiwami',
        commonUsage: 'Extreme/Ultimate (極限 kyoku-gen)',
        negativeConnotations: {
            exists: true,
            meanings: ['excessive', 'severe', 'terminal']
        }
    },
    {
        kanji: '快',
        meanings: ['pleasant', 'cheerful', 'comfortable', 'enjoyable'],
        pronunciation: 'kai',
        commonUsage: 'Pleasant/Comfort (快適 kai-teki)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '輝',
        meanings: ['shine', 'sparkle', 'radiant', 'brilliant'],
        pronunciation: 'ki, kagayaku',
        commonUsage: 'Shine/Brilliant (輝く kaga-yaku)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '幻',
        meanings: ['illusion', 'phantom', 'vision', 'dream'],
        pronunciation: 'gen, maboroshi',
        commonUsage: 'Illusion (幻想 gen-sō)',
        negativeConnotations: {
            exists: true,
            meanings: ['unreal', 'deceptive', 'false']
        }
    },
    {
        kanji: '穏',
        meanings: ['calm', 'gentle', 'peaceful', 'quiet'],
        pronunciation: 'on, odayaka',
        commonUsage: 'Calm/Gentle (穏やか oda-yaka)',
        negativeConnotations: {
            exists: false,
            meanings: []
        }
    },
    {
        kanji: '滅',
        meanings: ['destroy', 'perish', 'demolish', 'extinguish'],
        pronunciation: 'metsu, horobiru',
        commonUsage: 'Destroy/Perish (滅亡 metsu-bō)',
        negativeConnotations: {
            exists: true,
            meanings: ['annihilation', 'ruin', 'extinction']
        }
    }
]; 