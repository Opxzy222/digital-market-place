from ..models import Category

electronics = Category.objects.get(name='Electronics')
# sub-categories of Category
home_appliances = Category.objects.create(name='Home Appliance', parent=electronics)
computers = Category.objects.create(name='Computer', parent=electronics)
gadjets = Category.objects.create(name='Gadjet', parent=electronics)
office = Category.objects.create(name='Office', parent=electronics)
phones = Category.objects.create(name='Phone', parent=electronics)
tablet = Category.objects.create(name='Tablet', parent=electronics)

# sub-categories of Home Appliances
refrigerator = Category.objects.create(name='Refrigerator', parent=home_appliances)
washing_machine = Category.objects.create(name='Washing Machine', parent=home_appliances)
air_conditioner = Category.objects.create(name='Air Conditioner', parent=home_appliances)
microwave = Category.objects.create(name='Microwave', parent=home_appliances)
oven = Category.objects.create(name='Oven', parent=home_appliances)
vacuum_cleaner = Category.objects.create(name='Vacuum Cleaner', parent=home_appliances)
dish_washer= Category.objects.create(name='Dish Washer', parent=home_appliances)
water_heater = Category.objects.create(name='Water Heater', parent=home_appliances)

# sub-categories of Computers
deskstop = Category.objects.create(name='Deskstop', parent=computers)
laptop = Category.objects.create(name='Laptop', parent=computers)
accessory = Category.objects.create(name='Accessories', parent=computers)

# sub-categories of Gadjets
power_banks = Category.objects.create(name='Power Bank', parent=gadjets)
charger = Category.objects.create(name='Charger', parent=gadjets)
case = Category.objects.create(name='Case', parent=gadjets)
audio = Category.objects.create(name='Audio', parent=gadjets)
camera = Category.objects.create(name='Camera', parent=gadjets)
drone = Category.objects.create(name='Drone', parent=gadjets)

# sub-categories of office
printer = Category.objects.create(name='Printer', parent=office)
fax_machine = Category.objects.create(name='Fax Machine', parent=office)
scanner = Category.objects.create(name='Scanner', parent=office)
shredders = Category.objects.create(name='Shredders', parent=office)

#sub-categories of phones
smart_phone = Category.objects.create(name='SmartPhone', parent=phones)
phone_accessories = Category.objects.create(name='Phone Accessories', parent=phones)
peripherals = Category.objects.create(name='Phone Peripherals', parent=phones)
part = Category.objects.create(name='Phone Parts', parent=phones)

# sub-categories of Tablet
ipad = Category.objects.create(name='iPad', parent=tablet)
android = Category.objects.create(name='Android Tablets', parent=tablet)
window = Category.objects.create(name='Window Tablets', parent=tablet)
accessories = Category.objects.create(name='Tablet Accessories', parent=tablet)