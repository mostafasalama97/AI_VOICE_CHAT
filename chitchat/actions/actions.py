from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from transformers import pipeline

class ActionTransformersNER(Action):
    def name(self) -> str:
        return "action_transformers_ner"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:
        text = tracker.latest_message.get('text')
        ner = pipeline('ner')
        result = ner(text)
        
        entities = [f"Entity: {entity['word']}, Label: {entity['entity']}" for entity in result]
        response = "\n".join(entities)

        dispatcher.utter_message(text=response)
        return []

class ActionUtterGreeting(Action):

    def name(self) -> str:
        return "action_utter_greeting"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:
        user_message = tracker.latest_message.get('text')
        language = tracker.latest_message.get('metadata', {}).get('lang', 'en-US')
        
        if language == 'ar-SA':
            dispatcher.utter_message(text="مرحبًا! كيف يمكنني مساعدتك اليوم؟")
        else:
            dispatcher.utter_message(text="Hello! How can I help you today?")
        return []

class ActionUtterGoodbye(Action):

    def name(self) -> str:
        return "action_utter_goodbye"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:
        language = tracker.latest_message.get('metadata', {}).get('lang', 'en-US')
        
        if language == 'ar-SA':
            dispatcher.utter_message(text="وداعا!")
        else:
            dispatcher.utter_message(text="Bye")
        return []

class ActionUtterHowAreYou(Action):

    def name(self) -> str:
        return "action_utter_how_are_you"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:
        language = tracker.latest_message.get('metadata', {}).get('lang', 'en-US')
        
        if language == 'ar-SA':
            dispatcher.utter_message(text="أنا بخير، شكرًا لك! كيف حالك؟")
        else:
            dispatcher.utter_message(text="I am good, thank you! How about you?")
        return []

class ActionUtterUserSaysFine(Action):

    def name(self) -> str:
        return "action_utter_user_says_fine"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:
        language = tracker.latest_message.get('metadata', {}).get('lang', 'en-US')
        
        if language == 'ar-SA':
            dispatcher.utter_message(text="هذا رائع!")
        else:
            dispatcher.utter_message(text="I'm glad to hear that!")
        return []

class ActionUtterUserAskSalary(Action):

    def name(self) -> str:
        return "action_utter_user_ask_salary"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict) -> list:
        language = tracker.latest_message.get('metadata', {}).get('lang', 'en-US')
        
        if language == 'ar-SA':
            dispatcher.utter_message(text="ان شاء الله! والف الف مبرووك ماكسيمم تن دايز") 
        else:
            dispatcher.utter_message(text="bad and good and excellent")
        return []

def is_arabic(text):
    # Simple check if text contains Arabic characters
    return any("\u0600" <= char <= "\u06FF" for char in text)
