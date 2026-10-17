from django.shortcuts import render

# Los 15 productos de Birriería Paredes (los mismos de catalogo.json).
# Estos datos se insertan en el HTML en el servidor, ANTES de enviarlo
# al navegador: eso es el renderizado en servidor (SSR).
PRODUCTOS = [
    {"nombre": "Birria de res con consomé", "categoria": "Platillos", "precio": 120, "stock": 30},
    {"nombre": "Birria de chivo", "categoria": "Platillos", "precio": 140, "stock": 25},
    {"nombre": "Orden de tacos de birria (3)", "categoria": "Platillos", "precio": 90, "stock": 50},
    {"nombre": "Quesabirria (3)", "categoria": "Platillos", "precio": 110, "stock": 40},
    {"nombre": "Tacos dorados de birria (3)", "categoria": "Platillos", "precio": 85, "stock": 40},
    {"nombre": "Mulita de birria", "categoria": "Platillos", "precio": 75, "stock": 35},
    {"nombre": "Burrito de birria", "categoria": "Platillos", "precio": 95, "stock": 30},
    {"nombre": "Torta de birria", "categoria": "Platillos", "precio": 85, "stock": 30},
    {"nombre": "Consomé grande", "categoria": "Extras", "precio": 40, "stock": 60},
    {"nombre": "Frijoles charros", "categoria": "Extras", "precio": 35, "stock": 40},
    {"nombre": "Orden de arroz", "categoria": "Extras", "precio": 30, "stock": 40},
    {"nombre": "Agua de horchata 1L", "categoria": "Bebidas", "precio": 45, "stock": 50},
    {"nombre": "Agua de jamaica 1L", "categoria": "Bebidas", "precio": 45, "stock": 50},
    {"nombre": "Refresco 600 ml", "categoria": "Bebidas", "precio": 25, "stock": 80},
    {"nombre": "Cerveza", "categoria": "Bebidas", "precio": 40, "stock": 60},
]


def vista_ssr(request):
    contexto = {"productos": PRODUCTOS}
    return render(request, "catalogo/catalogo_ssr.html", contexto)