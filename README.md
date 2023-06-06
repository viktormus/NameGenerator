# NameGenerator
Software that generates Finnish (first) names.

**Background:** a friend of mine was graduating from university. He had lots of house plants, some of which had names. So, I had the idea to code, as a graduation gift, a name generator for his plants.

**How to use:** Install .exe file and run it on Windows.

**How it works:**

*Setup*

1. There are hardcoded name 'structures' of different length: eg. CVVCCV ('Jaakko'). C = consonant, V = vovel.
2. Vovels are split into two categories: 'clean' and 'rough'. Rough vovels include ä, ö, y, which are not compatible with some other vovels in Finnish language.
3. Some letters are not considered, namely those that are rarely used in Finnish, such as b, z, c, etc.

*Algorithm*

1. A word structure is chosen.
2. Letters corresponding to the type (vovel/consonant) are assigned randomly.
3. The word is redacted based on some rules, eg. two consecutive v's are not allowed.

--
Initially I coded the thing in Javascript, as I'm more comfortable with it. Afterwards, I converted the code into Python. That's why .py file has no commenting on the actual algorithm - only on the GUI part.
