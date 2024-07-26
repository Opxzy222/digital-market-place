from ...models import Category



deskstop = Category.objects.get(name='Deskstop')

# sub-categories of Desktop
dell = Category.objects.create(name='Dell', parent=deskstop)
hp = Category.objects.create(name='Hp', parent=deskstop)
lenovo = Category.objects.create(name='Lenovo', parent=deskstop)
acer = Category.objects.create(name='Acer', parent=deskstop)
asus = Category.objects.create(name='Asus', parent=deskstop)
msi = Category.objects.create(name='Msi', parent=deskstop)
intel = Category.objects.create(name='Intel', parent=deskstop)
microsoft = Category.objects.create(name='Microsoft', parent=deskstop)
apple = Category.objects.create(name='Apple', parent=deskstop)
zotac = Category.objects.create(name='Zotac', parent=deskstop)

laptop = Category.objects.get(name='Laptop')

# sub-categories of Laptop
dell = Category.objects.create(name='Dell', parent=laptop)
macbook = Category.objects.create(name='Macbook', parent=laptop)
hp = Category.objects.create(name='Hp', parent=laptop)
lenovo = Category.objects.create(name='Lenovo', parent=laptop)
asus = Category.objects.create(name='Asus', parent=laptop)
microsoft= Category.objects.create(name='Microsoft', parent=laptop)
acer = Category.objects.create(name='Acer', parent=laptop)
Huawei = Category.objects.create(name='Huawei', parent=laptop)
msi = Category.objects.create(name='MSI', parent=laptop)
google_pixel = Category.objects.create(name='Google pixel', parent=laptop)
lg = Category.objects.create(name='LG', parent=laptop)
toshiba = Category.objects.create(name='Toshiba', parent=laptop)
fujitsu = Category.objects.create(name='Fujitsu', parent=laptop)