from pathlib import Path
import argparse, shutil, subprocess
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter

root = Path(__file__).resolve().parents[2]
out = root / 'output' / 'pdf'
out.mkdir(parents=True, exist_ok=True)
destino = out / 'mi-primera-rutina.pdf'
for nombre, archivo in [('Texto','arial.ttf'), ('Titulo','arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(nombre, str(Path('C:/Windows/Fonts') / archivo)))
bg, tinta, acento, secundario, hundido = [HexColor(x) for x in ['#F2F4EF','#22302A','#4A765F','#52605A','#E6ECE5']]
w,h=A4
c=canvas.Canvas(str(destino), pagesize=A4)
c.setTitle('Mi primera rutina · Paso a Paso')
c.setAuthor('Paso a Paso · HadaApps')
c.setFillColor(bg);c.rect(0,0,w,h,fill=1,stroke=0)

def texto(x,y,t,tam=12,fuente='Texto',color=tinta):
    c.setFillColor(color);c.setFont(fuente,tam);c.drawString(x,y,t)

def campo(nombre,x,y,ancho,alto=28):
    c.acroForm.textfield(name=nombre,tooltip=nombre.replace('_',' '),x=x,y=y,width=ancho,height=alto,
        fontName='Helvetica',fontSize=12,textColor=tinta,borderColor=acento,fillColor=HexColor('#FBFCF9'),
        borderWidth=.8,borderStyle='underlined',forceBorder=True,maxlen=50)

texto(40,h-42,'PASO A PASO',12,'Titulo',acento)
for i,color in enumerate([acento,HexColor('#4F6D86'),hundido]):
    c.setFillColor(color);c.roundRect(w-124+i*24,h-43,20,6,3,fill=1,stroke=0)
texto(40,h-86,'Mi primera rutina',25,'Titulo')
texto(40,h-112,'Un momento del día. Hasta seis pasos. A tu ritmo.',13,color=secundario)
texto(40,h-134,'Puedes rellenar esta hoja en un lector de PDF o imprimirla.',11,color=secundario)

texto(40,h-176,'1. Elige un solo momento',16,'Titulo')
texto(40,h-196,'Por ejemplo: prepararse para salir o irse a dormir.',11,color=secundario)
campo('momento_de_la_rutina',40,h-236,w-80)

texto(40,h-276,'2. Ordena sus pasos',16,'Titulo')
texto(40,h-296,'Escribe una acción breve. Puedes añadir una foto o un dibujo.',11,color=secundario)
ancho=(w-92)/2
for i in range(6):
    x=40+(i%2)*(ancho+12)
    y=h-396-(i//2)*94
    c.setFillColor(HexColor('#FBFCF9'));c.setStrokeColor(hundido);c.roundRect(x,y,ancho,82,12,fill=1,stroke=1)
    texto(x+12,y+61,f'PASO {i+1}',10,'Titulo',acento)
    c.setFillColor(hundido);c.roundRect(x+12,y+12,44,38,6,fill=1,stroke=0)
    texto(x+18,y+28,'foto',10,color=secundario)
    campo(f'paso_{i+1}',x+68,y+15,ancho-80,30)

texto(40,222,'3. Acompaña un paso cada vez',16,'Titulo')
columnas=[('ANTES','Muestra lo que viene.'),('AHORA','Señala un solo paso.'),('DESPUÉS','Muestra el siguiente.')]
for i,(etiqueta,detalle) in enumerate(columnas):
    x=40+i*(w-80)/3
    texto(x,194,etiqueta,10,'Titulo',acento)
    texto(x,174,detalle,10,color=secundario)
texto(40,130,'No hace falta completar las seis casillas. Adáptalas a tu familia.',11,color=secundario)
c.setStrokeColor(hundido);c.line(40,104,w-40,104)
texto(40,82,'Una herramienta de organización para la vida cotidiana.',10,color=secundario)
texto(40,63,'Conoce la app: paso-a-paso-sigma.vercel.app',10,color=secundario)
c.linkURL('https://paso-a-paso-sigma.vercel.app',(40,55,w-40,76),relative=0)
c.showPage();c.save()

r=PdfReader(destino)
esperados={'momento_de_la_rutina',*[f'paso_{i}' for i in range(1,7)]}
assert set(r.get_fields())==esperados
assert len(r.pages)==1
widgets=[a.get_object() for a in r.pages[0]['/Annots'] if a.get_object().get('/Subtype')=='/Widget']
assert len(widgets)==7
assert all(a.get('/AP',{}).get('/N') for a in widgets)

# Comprobar también un ejemplar relleno, sin modificar el PDF que se entrega.
tmp=root/'tmp'/'pdfs';tmp.mkdir(parents=True,exist_ok=True)
ejemplo=tmp/'rutina-prueba-rellena.pdf'
writer=PdfWriter();writer.clone_document_from_reader(r)
valores={'momento_de_la_rutina':'Prepararse por la manana',**{f'paso_{i+1}':v for i,v in enumerate(['Despertar','Ir al bano','Vestirse','Desayunar','Cepillarse','Preparar la mochila'])}}
writer.update_page_form_field_values(None,valores,auto_regenerate=False)
with ejemplo.open('wb') as f: writer.write(f)
ver=PdfReader(ejemplo).get_fields()
assert all(ver[k]['/V']==v for k,v in valores.items())
dest_publico=root/'web'/'public'/'recursos'/'mi-primera-rutina.pdf'
dest_publico.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(destino,dest_publico)

parser=argparse.ArgumentParser();parser.add_argument('--poppler');args=parser.parse_args()
binario=args.poppler or shutil.which('pdftoppm')
png=root/'docs'/'revisiones'/'guia-recurso-pdf'
if binario:
    subprocess.run([binario,'-png','-singlefile','-r','110',str(destino),str(png)],check=True)
else:
    import pypdfium2 as pdfium
    pdfium.PdfDocument(str(destino))[0].render(scale=1.5).to_pil().save(str(png)+'.png')
print('PDF: una pagina, siete campos interactivos validados. Copia publica preparada. Ningun envio.')
