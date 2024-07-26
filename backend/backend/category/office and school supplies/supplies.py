office_school_supplies = Category.objects.create(name='Office & School Supplies', parent=None)
office_equipment = Category.objects.create(name='Office Equipment', parent=office_school_supplies)
school_supplies = Category.objects.create(name='School Supplies', parent=office_school_supplies)
printer_supplies = Category.objects.create(name='Printer Supplies', parent=office_school_supplies)
desk_accessories = Category.objects.create(name='Desk Accessories', parent=office_school_supplies)
backpacks = Category.objects.create(name='Backpacks', parent=office_school_supplies)

office_school_supplies = Category.objects.get(name='Office & School Supplies', parent=None)

office_equipment = Category.objects.get(name='Office Equipment', parent=office_school_supplies)
printers = Category.objects.create(name='Printers', parent=office_equipment)
scanners = Category.objects.create(name='Scanners', parent=office_equipment)
fax_machines = Category.objects.create(name='Fax Machines', parent=office_equipment)
projectors = Category.objects.create(name='Projectors', parent=office_equipment)
office_furniture = Category.objects.create(name='Office Furniture', parent=office_equipment)

school_supplies = Category.objects.get(name='School Supplies', parent=office_school_supplies)
notebooks_school = Category.objects.create(name='Notebooks', parent=school_supplies)
writing_utensils = Category.objects.create(name='Writing Utensils', parent=school_supplies)
binders = Category.objects.create(name='Binders', parent=school_supplies)
calculators = Category.objects.create(name='Calculators', parent=school_supplies)
art_supplies_school = Category.objects.create(name='Art Supplies', parent=school_supplies)

printer_supplies = Category.objects.get(name='Printer Supplies', parent=office_school_supplies)
printer_ink = Category.objects.create(name='Printer Ink', parent=printer_supplies)
toner = Category.objects.create(name='Toner', parent=printer_supplies)
printing_paper = Category.objects.create(name='Printing Paper', parent=printer_supplies)
printer_maintenance_kits = Category.objects.create(name='Printer Maintenance Kits', parent=printer_supplies)

desk_accessories = Category.objects.get(name='Desk Accessories', parent=office_school_supplies)
desk_organizers_office = Category.objects.create(name='Desk Organizers', parent=desk_accessories)
paper_clips = Category.objects.create(name='Paper Clips', parent=desk_accessories)
staplers = Category.objects.create(name='Staplers', parent=desk_accessories)
tape_dispensers = Category.objects.create(name='Tape Dispensers', parent=desk_accessories)
letter_openers = Category.objects.create(name='Letter Openers', parent=desk_accessories)

backpacks = Category.objects.get(name='Backpacks', parent=office_school_supplies)
school_backpacks = Category.objects.create(name='School Backpacks', parent=backpacks)
laptop_backpacks = Category.objects.create(name='Laptop Backpacks', parent=backpacks)
travel_backpacks = Category.objects.create(name='Travel Backpacks', parent=backpacks)
outdoor_backpacks = Category.objects.create(name='Outdoor Backpacks', parent=backpacks)
fashion_backpacks = Category.objects.create(name='Fashion Backpacks', parent=backpacks)

