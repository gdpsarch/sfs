def process():
    mode = input("Виберіть дію (1 - Зашифрувати, 2 - Розшифрувати): ")
    
    if mode == '1':
        text = input("Введіть текст: ")
        # Перетворюємо рядок у байти (UTF-8), а потім у HEX
        encrypted = text.encode('utf-8').hex()
        print(f"\nВаш зашифрований текст:\n{encrypted}")
        
    elif mode == '2':
        data = input("Введіть зашифрований рядок: ")
        try:
            # Перетворюємо HEX назад у байти, а байти - у текст
            decrypted = bytes.fromhex(data).decode('utf-8')
            print(f"\nВаш розшифрований текст:\n{decrypted}")
        except:
            print("\nПомилка: Невірний формат шифрування (перевірте, чи рядок складається тільки з 0-9, a-f).")
    
    input("\nНатисніть Enter, щоб вийти...")

process()