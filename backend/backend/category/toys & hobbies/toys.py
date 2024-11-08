toys_hobbies = Category.objects.create(name='Toys & Hobbies', parent=None)
toy_stores = Category.objects.create(name='Toy Stores', parent=toys_hobbies)
hobby_shops = Category.objects.create(name='Hobby Shops', parent=toys_hobbies)
model_shops = Category.objects.create(name='Model Shops', parent=toys_hobbies)
board_game_stores = Category.objects.create(name='Board Game Stores', parent=toys_hobbies)
puzzle_shops = Category.objects.create(name='Puzzle Shops', parent=toys_hobbies)
craft_stores = Category.objects.create(name='Craft Stores', parent=toys_hobbies)

toy_stores = Category.objects.create(name='Toy Stores', parent=toys_hobbies)
action_figures = Category.objects.create(name='Action Figures', parent=toy_stores)
dolls = Category.objects.create(name='Dolls', parent=toy_stores)
building_blocks = Category.objects.create(name='Building Blocks', parent=toy_stores)
stuffed_animals = Category.objects.create(name='Stuffed Animals', parent=toy_stores)
educational_toys = Category.objects.create(name='Educational Toys', parent=toy_stores)
remote_control_toys = Category.objects.create(name='Remote Control Toys', parent=toy_stores)
puzzles_toys = Category.objects.create(name='Puzzles', parent=toy_stores)

hobby_shops = Category.objects.create(name='Hobby Shops', parent=toys_hobbies)
model_kits = Category.objects.create(name='Model Kits', parent=hobby_shops)
train_sets = Category.objects.create(name='Train Sets', parent=hobby_shops)
radio_control_vehicles = Category.objects.create(name='Radio-Controlled Vehicles', parent=hobby_shops)
collectible_card_games = Category.objects.create(name='Collectible Card Games', parent=hobby_shops)
scale_models = Category.objects.create(name='Scale Models', parent=hobby_shops)

model_shops = Category.objects.create(name='Model Shops', parent=toys_hobbies)
plastic_models = Category.objects.create(name='Plastic Models', parent=model_shops)
wooden_models = Category.objects.create(name='Wooden Models', parent=model_shops)
diecast_models = Category.objects.create(name='Diecast Models', parent=model_shops)
railroad_models = Category.objects.create(name='Railroad Models', parent=model_shops)
aircraft_models = Category.objects.create(name='Aircraft Models', parent=model_shops)

board_game_stores = Category.objects.create(name='Board Game Stores', parent=toys_hobbies)
strategy_games = Category.objects.create(name='Strategy Games', parent=board_game_stores)
family_games = Category.objects.create(name='Family Games', parent=board_game_stores)
party_games = Category.objects.create(name='Party Games', parent=board_game_stores)
educational_games = Category.objects.create(name='Educational Games', parent=board_game_stores)
role_playing_games = Category.objects.create(name='Role-Playing Games', parent=board_game_stores)

puzzle_shops = Category.objects.create(name='Puzzle Shops', parent=toys_hobbies)
jigsaw_puzzles = Category.objects.create(name='Jigsaw Puzzles', parent=puzzle_shops)
d_puzzles = Category.objects.create(name='3D Puzzles', parent=puzzle_shops)
brain_teasers = Category.objects.create(name='Brain Teasers', parent=puzzle_shops)
crossword_puzzles = Category.objects.create(name='Crossword Puzzles', parent=puzzle_shops)

craft_stores = Category.objects.create(name='Craft Stores', parent=toys_hobbies)
scrapbooking_supplies = Category.objects.create(name='Scrapbooking Supplies', parent=craft_stores)
knitting_supplies = Category.objects.create(name='Knitting Supplies', parent=craft_stores)
beading_supplies = Category.objects.create(name='Beading Supplies', parent=craft_stores)
sewing_supplies = Category.objects.create(name='Sewing Supplies', parent=craft_stores)
painting_supplies = Category.objects.create(name='Painting Supplies', parent=craft_stores)