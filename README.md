# NameGenerator
Software that generates Finnish (first) names.

**Background:** a friend of mine was graduating from university. He had lots of house plants, some of which had names. So, I had the idea to code, as a graduation gift, a name generator for his plants.

**How to use:** There are two .exe files. 'Win' works on Windows. 'Universal' should work on Windows, macOS, and Linux... though I've only tested it on Windows.

**How it works:**

*Setup*

There are hardcoded name 'structures' of different length: eg. CVVCCV ('Jaakko'). C = consonant, V = vovel.
Vovels are split into two categories: 'clean' and 'rough'. Rough vovels include ä, ö, y, which are not compatible with some other vovels in Finnish language.
Some letters are not considered, namely those that are rarely used in Finnish, such as b, z, c, etc.

1. A word structure is chosen.
2. Letters corresponding to the type (vovel/consonant) are assigned randomly.
3. 

--
Initially I coded the thing in Javascript, as I'm more comfortable with it. Afterwards, I converted the code into Python. That's why .py file has no commenting on the actual algorithm - only on the GUI part.
