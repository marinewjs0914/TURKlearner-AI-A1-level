import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'basics_greetings', label: '基礎問候 (Greetings)', emoji: '👋', promptTopic: 'A1 level basic greetings: Hello, Good morning, Thank you, Yes, No. Absolute essentials.' },
  { id: 'numbers_colors', label: '數字與顏色 (Numbers)', emoji: '🔢', promptTopic: 'A1 level numbers (1-100) and basic colors (red, blue, green, black, white).' },
  { id: 'family', label: '家庭成員 (Family)', emoji: '👨‍👩‍👧', promptTopic: 'A1 level family members: mother, father, sister, brother, baby, grandmother.' },
  { id: 'daily_verbs', label: '常用動詞 (Basic Verbs)', emoji: '🏃', promptTopic: 'A1 level essential verbs: go, come, eat, drink, sleep, look, listen. Simple imperatives.' },
  { id: 'food_drink', label: '食物飲料 (Food)', emoji: '🍎', promptTopic: 'A1 level basic food: water, bread, apple, tea, coffee, milk, sugar.' },
  { id: 'home_objects', label: '居家物品 (Home)', emoji: '🏠', promptTopic: 'A1 level house vocabulary: door, window, table, chair, bed, room, house.' },
  { id: 'clothing', label: '衣服穿著 (Clothes)', emoji: '👕', promptTopic: 'A1 level basic clothing: shirt, pants, shoes, hat, jacket, dress.' },
  { id: 'body_parts', label: '身體部位 (Body)', emoji: '👀', promptTopic: 'A1 level basic body parts: head, eye, hand, foot, leg, mouth, nose.' },
  { id: 'animals', label: '常見動物 (Animals)', emoji: '🐱', promptTopic: 'A1 level common animals: cat, dog, bird, fish, horse, chicken.' },
  { id: 'time_calendar', label: '時間日期 (Time)', emoji: '📅', promptTopic: 'A1 level time basics: today, tomorrow, yesterday, morning, night, day, week.' },
  { id: 'places_city', label: '城市地點 (Places)', emoji: '🏫', promptTopic: 'A1 level city places: school, park, hospital, shop, street, home, restaurant.' },
  { id: 'transport', label: '交通工具 (Transport)', emoji: '🚌', promptTopic: 'A1 level basic transport: car, bus, taxi, train, plane, bicycle.' },
  { id: 'adjectives_1', label: '形容詞 I (Adjectives)', emoji: '👍', promptTopic: 'A1 level basic opposites: big/small, hot/cold, good/bad, new/old.' },
  { id: 'adjectives_2', label: '形容詞 II (Emotions)', emoji: '😊', promptTopic: 'A1 level simple feelings: happy, sad, tired, hungry, thirsty, beautiful.' },
  { id: 'professions', label: '職業工作 (Jobs)', emoji: '👮', promptTopic: 'A1 level common jobs: teacher, doctor, student, driver, cook, police.' },
  { id: 'nature', label: '自然景觀 (Nature)', emoji: '🌲', promptTopic: 'A1 level nature basics: sun, moon, tree, flower, water, rain, snow.' },
  { id: 'questions', label: '疑問詞 (Questions)', emoji: '❓', promptTopic: 'A1 level question words: What? Who? Where? When? Why? How? How much?' },
  { id: 'pronouns', label: '代名詞 (Pronouns)', emoji: '👉', promptTopic: 'A1 level personal pronouns: I, you, he/she/it, we, they, my, your.' },
  { id: 'conjunctions', label: '連接詞 (Connectors)', emoji: '🔗', promptTopic: 'A1 level very basic connectors: and (ve), but (ama), or (veya), because (çünkü).' },
  { id: 'emergency_a1', label: '緊急求助 (Help)', emoji: '🆘', promptTopic: 'A1 level emergency phrases: Help! Stop! Doctor! Police! I don\'t understand.' },
];

export const AUDIO_SAMPLE_RATE = 24000;