import os
from django import setup
from django.db import transaction

# Set the DJANGO_SETTINGS_MODULE environment variable to your settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Initialize Django
setup()

from backend.models import Category, Subcategory, ProductSuggestion


# Get the Tablet and Office Electronics categories
tablet_category = Category.objects.get(name='Tablet')
office_electronics_category = Category.objects.get(name='Office')

# Define additional product suggestions for each subcategory
additional_tablet_suggestions = {
    "iPad": [
        "Apple iPad Air 3", "Apple iPad 7th Gen", "Apple iPad Pro 2nd Gen", "Apple iPad Mini 4",
        "Apple iPad 6th Gen", "Apple iPad Pro 1st Gen", "Apple iPad Air 2", "Apple iPad 5th Gen",
        "Apple iPad Mini 3", "Apple iPad 4th Gen"
    ],
    "Android Tablet": [
        "Huawei MediaPad T5", "Samsung Galaxy Tab Active3", "Samsung Galaxy Tab E", "Samsung Galaxy Tab S2",
        "Lenovo Tab M10 Plus", "Lenovo Yoga Tab 3", "Amazon Fire HD 8 Kids Edition", "Samsung Galaxy Tab A 10.1",
        "Asus ZenPad Z10", "Huawei MediaPad M3"
    ],
    "Windows Tablet": [
        "HP Spectre x2", "Dell XPS 12", "Microsoft Surface Pro 5", "Lenovo Yoga Book",
        "Acer Switch 7", "HP Elite x2", "Asus Transformer Pro T304", "Lenovo IdeaPad Miix 700",
        "Dell Latitude 5290", "Microsoft Surface Pro 4"
    ],
    "E-Reader": [
        "Kobo Nia", "PocketBook InkPad X", "Barnes & Noble Nook Tablet 7", "Amazon Kindle Voyage",
        "Kobo Aura One", "Barnes & Noble Nook Simple Touch", "Amazon Kindle DX", "Sony PRS-T2",
        "PocketBook Color", "Kobo Aura H2O"
    ]
}

additional_office_electronics_suggestions = {
    "Printer": [
        "Epson Expression Premium XP-7100", "Brother HL-L2395DW", "Canon PIXMA MG3620", "HP Envy Photo 7155",
        "Epson EcoTank ET-2720", "Brother MFC-J6945DW", "Canon PIXMA TS5320", "HP Color LaserJet Pro M255dw",
        "Epson WorkForce WF-7710", "Brother HL-L8360CDW"
    ],
    "Scanner": [
        "Canon imageFORMULA R40", "Epson Perfection V850 Pro", "Brother ADS-1250W", "Fujitsu fi-7160",
        "Canon P-208II", "HP OfficeJet 250", "Epson DS-320", "Brother DS-640", "Fujitsu ScanSnap SV600",
        "Epson WorkForce ES-400"
    ],
    "Projector": [
        "Optoma UHD60", "BenQ HT3550", "ViewSonic M1", "LG HU80KA", "Epson Pro EX9220",
        "Anker Nebula Mars II Pro", "BenQ MH530FHD", "Epson EF-100", "Optoma GT1080HDR", "ViewSonic PX706HD"
    ],
    "Fax Machine": [
        "Panasonic KX-FP205", "Brother IntelliFax-775", "Canon FAXPHONE L75", "Panasonic KX-FHD331",
        "HP OfficeJet 250 Mobile", "Samsung SF-760P", "Brother IntelliFax-4100e", "Canon imageCLASS D550",
        "Ricoh SP 4510SF", "Panasonic KX-MB3020"
    ],
    "Office Phone": [
        "Yealink SIP-T46S", "Polycom SoundStation IP 6000", "Cisco IP Phone 7960", "Avaya 9641GS",
        "Grandstream GXV3275", "Panasonic KX-TGE433B", "Mitel 5330e IP Phone", "VTech DS6771-3",
        "AT&T SynJ SB67138", "Cisco IP Phone 7961G"
    ],
    "Shredder": [
        "Aurora AU1210MA", "Fellowes AutoMax 200C", "AmazonBasics 15-Sheet Cross-Cut", "Bonsaii DocShred C560-D",
        "Fellowes Powershred 125Ci", "Royal Sovereign 120X", "HSM SECURIO B32c", "Swingline EX10-06",
        "GBC Cross-Cut Shredder", "Aurora AS890C"
    ]
}

# Create additional Tablet suggestions
for subcategory_name, suggestions in additional_tablet_suggestions.items():
    # Get or create the subcategory
    subcategory, created = Subcategory.objects.get_or_create(name=subcategory_name, category=tablet_category)
    
    for suggestion in suggestions:
        ProductSuggestion.objects.create(name=suggestion, category=tablet_category, subcategory=subcategory)

# Create additional Office Electronics suggestions
for subcategory_name, suggestions in additional_office_electronics_suggestions.items():
    # Get or create the subcategory
    subcategory, created = Subcategory.objects.get_or_create(name=subcategory_name, category=office_electronics_category)
    
    for suggestion in suggestions:
        ProductSuggestion.objects.create(name=suggestion, category=office_electronics_category, subcategory=subcategory)

print("Additional Tablet and Office Electronics product suggestions updated successfully.")
