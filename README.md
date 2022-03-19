# Development

```
cd tetris
npm install
npm start
```

# Build

```
cd tetris
npm run build
cd ./docs
```

# Задание
Реализовать клон Tetris c прогрессией и аналитикой. Шаблон содержит базовую механику тетриса с одной тетрамино. Необходимо дополнить игру, включив туда обязательные игровые механики, а также придумать и реализовать дополнительные механики. За обязательные механики можно получить 10 баллов, за дополнительные еще 5. Присылать задание необходимо в виде ссылки не репо и активной ссылки на игру размещенную на github pages.

Обязательные требования (10 баллов):

1) ~Добавить все остальные тетрамино~
2) ~Ускорять падение активной фигуры по стрелке вниз~
3) ~Добавить механику поворота активной фигуры~
4) ~Механика стирания заполненной строки~
5) ~Счетчик заполненных линий~
6) ~Оптимизировать collision detection~
7) ~Экран поражения с количестовм набранных очков и кнопкой сыграть еще раз~

Идеи для дополнительных механик (5 баллов):

1) Механика прогрессии: увеличивать скорость падения с ростом числа заполненных линий
2) «Отложенная фигура»
3) «Мигающий квадратик»
4) Любые непонятные бонусные фигуры
5) Можно грабить корованы (любые экспериментальные режимы, типа изменения направления гравитации или двунаправленного тетриса)

Подсмотреть красивый дизайн можно тут: https://dribbble.com/shots/14902579-Tetris-Mobile-App-Design-Exploration/attachments/6616066?mode=media
