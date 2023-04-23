import PySimpleGUI as sg
import math
import random
import textwrap

# NAMEGEN

#print("Welcome to the name generator!")
#print("Let's generate a couple cool names for ya\n")

cleanVovels = ["a", "e", "i", "o", "u"]
roughVovels = ["e", "i", "y", "ä", "ö"]
consonants = ["h", "j", "k", "l", "m", "n", "p", "r", "s", "t", "v"]

templates = [["VCV"],["CVCV", "VCCV", "CVVC", "VVCV"],["CVCCV", "VCVCV", "CVVCV", "VVCCV"],["VCVCCV", "CVVCCV", "VCCVCV", "CVCCVC"], ["CVCCVCV"], ["CVVCVCVC", "VCVCVVCV"]]

def rand(list):
  return list[math.floor(random.random() * len(list))]

def chooseLetter(type, vovels):
  if type == "C":
    return rand(consonants)
  return rand(vovels)

def assignLetters(structure, vovels, doubleProb):
  word = ""
  for i in range(len(structure)):
    if i != 0 and structure[i - 1] == structure[i]:
      if random.random() < doubleProb:
        word += word[len(word) - 1]
      else:
        letter = chooseLetter(structure[i], vovels)
        while letter == word[i - 1]:
          letter = chooseLetter(structure[i], vovels)
        word += letter
    else:
      word += chooseLetter(structure[i], vovels)
  return word

noDouble = ["v", "h", "j"]
noEnd = ["v", "h", "j"]

def redactWord(word):
  if len(word) == 1:
    return word
  modified = word[0]
  i = 1
  while i < len(word) - 1:
    if word[i] == word[i + 1] and len(list(filter(lambda x : x == word[i], noDouble))) > 0:
      newL = rand(consonants)
      while len(list(filter(lambda x : x == newL, noDouble))) > 0:
        newL = rand(consonants)
      modified += newL + newL
      i += 1
    else:
      modified += word[i]
    i += 1
  if len(modified) == len(word):
    return modified
  last = len(word) - 1
  if len(list(filter(lambda x : x == word[last], noEnd))) > 0:
    newL = rand(consonants)
    while len(list(filter(lambda x : x == newL, noDouble))) > 0:
      newL = rand(consonants)
    return modified + newL
  return modified + word[last]

def validateArgs(length, vovels, number, structure, doubleProb):
  if length < 3 or length > 8: return [True, "The word length needs to be 3-8 characters."]
  if not (vovels == 0 or vovels == 1): return [True, "The vovel variable must be 0 or 1."]
  if number < 1 or number > 20: return [True, "The number of generated names must be 1-10."]
  if structure != "" and (len(structure) < 1 or len(structure) > 20): return [True, "The word structure must be 1-20 characters."]
  if structure != "":
    for i in structure:
      if not (i == "C" or i == "V"): return [True, "The word structure must only contain letters C and V."]
  if doubleProb < 0 or doubleProb > 1: return [True, "Double letter probability must be between 0 and 1."]
  return [False, "Arguments validated and accepted."]

def generate(length, vovels, number, structure = "", doubleProb = 0.5):
  vovs = cleanVovels
  if vovels == 0:
    vovs = roughVovels
  if structure == "":
    structure = rand(templates[length - 3])
  names = []
  for i in range(number):
    original = assignLetters(structure, vovs, doubleProb)
    modified = redactWord(original)
    names.append(modified)
  return names

def valGenPrint(length, vovels, number, structure = "", doubleProb = 0.5):
  length = round(length)
  number = round(number)
  structure = structure.upper()
  val = validateArgs(length, vovels, number, structure, doubleProb)
  if val[0]:
    return val[1]
  names = generate(length, vovels, number, structure, doubleProb)
  nameList = ""
  for i in names:
    nameList += i
    nameList += "\n"
  return nameList.strip("\n")

#print(valGenPrint(4, 1, 3, "CCC"))





# GUI

# Set color theme
sg.theme('DefaultNoMoreNagging')

# Defining the layout
layout_l = [
            [sg.Text('Welcome to the Name Generator.\nSelect the options and smash that \'generate\' button.')],
            [sg.Text("Number of generated names:")],
            [sg.Slider((1,20), default_value=10, orientation='h', s=(25,15))],
            [sg.Text("Vovels:")],
            [sg.Radio('Clean', 1, default=True), sg.Radio('Rough', 1)],
            [sg.Text("Name length:")],
            [sg.Radio('3', 2), sg.Radio('4', 2), sg.Radio('5', 2, default=True), sg.Radio('6', 2), sg.Radio('7', 2), sg.Radio('8', 2)],
            [sg.Text("Probability of a double vovel/consonant:")],
            [sg.Slider((0,1), default_value=0.5, resolution=0.01, orientation='h', s=(25,15))],
            [sg.Text("Custom name structure (optional):")],
            [sg.Input(s=(32,15))],
            [sg.Text("Use only letters C (=consonant) and V (=vovel).\nMinimum word length is 1, maximum is 20.\nThis option overwrites previously chosen name length.\nOtherwise, name structure is chosen \'randomly\' based on length.")],
            [sg.Text("")],
            [sg.Button('Generate'), sg.Button('Exit')]
            ]

layout_r = [
            [sg.Frame('Output', [[sg.T("alfa", key='-TEXT-')]], s=(180,450))]
            ]

layout = [[sg.Col(layout_l, p=0), sg.Col(layout_r, p=0)]]

# Creating the window
window = sg.Window('Name Generator', layout)

# Creating the event loop
while True:
    # Read the event that happened and the values dictionary
    event, values = window.read()   
    #print(event, values)
    # If user closed window with X or if user clicked "Exit" button then exit
    if event == sg.WIN_CLOSED or event == 'Exit':     
      break
    if event == 'Generate':
      # Convert inputs to function parameters
      number = values[0]
      vovels = 1
      if values[2]:
        vovels = 0
      i = 3
      while i < 9:
        if values[i]:
          break
        i += 1
      length = i
      structure = values[10]
      doubleProb = values[9]

      # Generate a string of names
      string = valGenPrint(length, vovels, number, structure, doubleProb)

      # Wrap (long) error messages
      if len(list(filter(lambda x : x == "\n", string))) == 0:
        string = textwrap.fill(string, 25)

      # Update output
      window["-TEXT-"].update(string)

window.close()