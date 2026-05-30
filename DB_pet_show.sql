drop database if exists DB_pet_show;
create database DB_pet_show;
use DB_pet_show;

create table Pessoa(
	id_pessoa int auto_increment primary key,
    nome varchar(100) not null,
    email varchar(100) not null,
    senha varchar(20) not null);

create table Telefone (
	id_telefone int auto_increment primary key,
    tipo enum("TEL", "CEL", "COM"),
    numero char(11),
    id_fk_pessoa int not null);

create table Endereco(
	id_endereco int primary key auto_increment,
    estado char(2) not null,
    cidade varchar(100) not null,
    bairro varchar(100) not null,
    rua varchar(100) not null,
    numero int not null,
    complemento varchar(100) null,
    id_fk_pessoa int not null);

create table Produto(
	id_produto int primary key auto_increment,
    nome varchar(100) not null,
    quantidade_disponivel int not null,
    preco float(10,2) not null,
    descricao varchar(1000) not null,
    imagens varchar(500) not null,
    promocao int not null,
    animal enum("gato", "peixe", "cachorro", "passaro", "reptil") not null,
    classe enum("comida", "brinquedo", "casa") not null);
    
Alter table Produto 
modify animal varchar(20),
modify imagens varchar(1000);

create table Fornecedor(
	id_fk_pessoa int not null unique,
    CNPJ char(18) not null);
    
create table Cliente(
	id_fk_pessoa int not null unique,
    CPF char(11),
    data_cadastro date not null,
    data_nascimento date not null,
    sexo enum("F", "M", "I"));

create table FornecedorProduto(
	id_fornecedor_produto int primary key auto_increment,
    id_fk_produto int not null,
    id_fk_fornecedor int not null,
    quantidade int not null);

create table ClienteProduto(
	id_cliente_produto int primary key auto_increment,
    id_fk_produto int not null,
    id_fk_cliente int not null);

alter table Pessoa
add tipo enum("Cliente", "fornecedor");

alter table Telefone 
add constraint Id_fk_telefone_pessoa
foreign key (id_fk_pessoa)
references Pessoa(id_pessoa);

alter table Endereco
add constraint Id_fk_endereco_pessoa
foreign key (id_fk_pessoa)
references Pessoa(id_pessoa);

alter table Fornecedor
add constraint Id_fk_fornecedor_pessoa
foreign key (id_fk_pessoa)
references Pessoa(id_pessoa);

alter table Cliente
add Constraint Id_fk_cliente_pessoa
foreign key (id_fk_pessoa)
references Pessoa(id_pessoa);

alter table FornecedorProduto
add constraint Id_fk_FP_produto
foreign key (id_fk_produto)
references Produto(id_produto),
add constraint Id_fk_FP_fornecedor
foreign key (id_fk_fornecedor)
references Pessoa(id_pessoa);

alter table ClienteProduto
add constraint Id_fk_CP_produto
foreign key (id_fk_produto)
references Produto(id_produto),
add constraint Id_fk_CP_cliente
foreign key (id_fk_cliente)
references Pessoa(id_pessoa);

drop database if exists BK_DB_pet_show;
create database BK_DB_pet_show;
use BK_DB_pet_show;

create table BK_Pessoa(
	BK_id_pessoa int auto_increment primary key,
    id_pessoa int not null,
    nome varchar(100) not null,
    email varchar(100) not null,
    senha varchar(20) not null,
    status char(1) not null,
    user varchar(50) not null);

create table BK_Telefone (
	BK_id_telefone int auto_increment primary key,
    id_telefone int not null,
    tipo enum("TEL", "CEL", "COM"),
    numero char(11),
    id_fk_pessoa int null,
    status char(1) not null,
    user varchar(50) not null);

create table BK_Endereco(
	BK_id_endereco int primary key auto_increment,
    id_endereco int not null,
    estado char(2) not null,
    cidade varchar(100) not null,
    bairro varchar(100) not null,
    rua varchar(100) not null,
    numero int not null,
    complemento varchar(100) null,
    id_fk_pessoa int not null,
    status char(1) not null,
    user varchar(50) not null);

create table BK_Produto(
	BK_id_produto int primary key auto_increment,
    id_produto int not null,
    nome varchar(100) not null,
    quantidade_disponivel int not null,
    preco float(10,2) not null,
    descricao varchar(1000) not null,
    imagens varchar(500) not null,
    promocao int not null,
    animal enum("gato", "cachorro", "passaro", "reptil") not null,
    classe enum("comida", "brinquedo", "peixe", "casa") not null,
    status char(1) not null,
    user varchar(50) not null);

alter table BK_DB_pet_show.BK_Produto
modify animal varchar(20),
modify imagens varchar(1000);

create table BK_Fornecedor(
	BK_id_pessoa int primary key auto_increment,
    id_fk_pessoa int not null,
    CNPJ char(18) not null,
    status char(1) not null,
    user varchar(50) not null);
    
create table BK_Cliente(
	BK_id_pessoa int auto_increment primary key,
    id_fk_pessoa int not null,
    CPF char(11),
    data_cadastro date not null,
    data_nascimento date not null,
    sexo enum("F", "M", "I"),
    status char(1) not null,
    user varchar(50) not null);

create table BK_FornecedorProduto(
	BK_id_fornecedor_produto int primary key auto_increment,
    id_fornecedor_produto int not null,
    id_fk_produto int not null,
    id_fk_fornecedor int not null,
    quantidade int not null,
    status char(1) not null,
    user varchar(50) not null);

create table BK_ClienteProduto(
	BK_id_cliente_produto int primary key auto_increment,
    id_cliente_produto int not null,
    id_fk_produto int not null,
    id_fk_cliente int not null,
    status char(1) not null,
    user varchar(50) not null);

alter table BK_Pessoa
add tipo enum("Cliente", "fornecedor");

use DB_pet_show;

delimiter $

create trigger Salvando_BK_pessoa
after insert
on Pessoa
for each row
begin 
	insert into BK_DB_pet_show.BK_Pessoa values (null, new.id_pessoa, new.nome, new.email, new.senha, "C", current_user(), new.tipo);
end$

create trigger Salvando_BK_telefone
after insert
on Telefone
for each row
begin
	insert into BK_DB_pet_show.BK_Telefone values (null, new.id_telefone, new.tipo, new.numero, new.id_fk_pessoa, "C", current_user());
end$

create trigger Salvando_BK_endereco
after insert
on Endereco
for each row
begin
	insert into BK_DB_pet_show.BK_Endereco values(null, new.id_endereco, new.estado, new.cidade, new.bairro, new.rua, new.numero, 
		new.complemento, new.id_fk_pessoa, "C",current_user());
end$

create trigger Salvando_BK_produto
after insert
on Produto
for each row
begin
	insert into BK_DB_pet_show.BK_Produto values(null, new.id_produto, new.nome, 
     new.quantidade_disponivel, new.preco, new.descricao,
		new.imagens, new.promocao, new.animal, new.classe, "C",current_user());
end$

create trigger Salvando_BK_fornecedor
after insert
on Fornecedor
for each row
begin
	insert into BK_DB_pet_show.BK_Fornecedor values(null, new.id_fk_pessoa, new.CNPJ, "C", current_user());
end$

create trigger Salvando_BK_cliente
after insert
on Cliente
for each row
begin
	insert into BK_DB_pet_show.BK_Cliente values(null, new.id_fk_pessoa, new.CPF,
    new.data_cadastro, new.data_nascimento,
		new.sexo, "C",current_user());
end$

create trigger Salvando_BK_FP
after insert
on FornecedorProduto
for each row
begin
	insert into BK_DB_pet_show.BK_FornecedorProduto values (null, new.id_fornecedor_produto, 
    new.id_fk_produto, new.id_fk_fornecedor, 
		new.quantidade, "C", current_user());
end$

create trigger Salvando_BK_CP
after insert
on ClienteProduto
for each row
begin
	insert into BK_DB_pet_show.BK_ClienteProduto values (null, new.id_cliente_produto,
    new.id_fk_produto, new.id_fk_cliente, "C",current_user());
end$


create trigger Alterando_BK_pessoa
after update
on Pessoa
for each row
begin 
	insert into BK_DB_pet_show.BK_Pessoa
	(BK_id_pessoa, id_pessoa, nome, email, senha, status, user, tipo)
	values (null, new.id_pessoa, new.nome, new.email,
    new.senha, "U", current_user(), new.tipo);
end $


create trigger Alterando_BK_telefone
after update
on Telefone
for each row
begin
	insert into BK_DB_pet_show.BK_Telefone values (null, new.id_telefone, new.tipo, new.numero,
    new.id_fk_pessoa, "U", current_user());
end$

create trigger Alterando_BK_endereco
after update
on Endereco
for each row
begin
	insert into BK_DB_pet_show.BK_Endereco values(null, new.id_endereco, new.estado, new.cidade, new.bairro, new.rua, new.numero, 
		new.complemento, new.id_fk_pessoa, "U", current_user());
end$

create trigger Alterando_BK_produto
after update
on Produto
for each row
begin
	insert into BK_DB_pet_show.BK_Produto values(null, new.id_produto, new.nome, 
     new.quantidade_disponivel, new.preco, new.descricao,
		new.imagens, new.promocao, new.animal, new.classe, "U", current_user());
end$

create trigger Alterando_BK_fornecedor
after update
on Fornecedor
for each row
begin
	insert into BK_DB_pet_show.BK_Fornecedor values(null, new.id_fk_pessoa, new.CNPJ, "U", current_user());
end$

create trigger Alterando_BK_cliente
after update
on Cliente
for each row
begin
	insert into BK_DB_pet_show.BK_Cliente values(null, new.id_fk_pessoa, new.CPF, new.data_cadastro, new.data_nascimento,
		new.sexo, "U",current_user());
end$

create trigger Alterando_BK_FP
after update
on FornecedorProduto
for each row
begin
	insert into BK_DB_pet_show.BK_FornecedorProduto values (null, new.id_fornecedor_produto, new.id_fk_produto, new.id_fk_fornecedor, 
		new.quantidade, "U", current_user());
end$

create trigger Alterando_BK_CP
after update
on ClienteProduto
for each row
begin
	insert into BK_DB_pet_show.BK_ClienteProduto values (null, new.id_cliente_produto, 
    new.id_fk_produto, new.id_fk_cliente, "U",current_user());
end$


create trigger Deletando_BK_pessoa
before delete
on Pessoa
for each row
begin 
	insert into BK_DB_pet_show.BK_Pessoa values (null, old.id_pessoa, old.nome, old.email, old.senha,
    "D", current_user(), old.tipo);
end $

create trigger Deletando_BK_telefone
before delete
on Telefone
for each row
begin
	insert into BK_DB_pet_show.BK_Telefone values (null, old.id_telefone, old.tipo, old.numero, old.id_fk_pessoa, "D", current_user());
end$

create trigger Deletando_BK_endereco
before delete
on Endereco
for each row
begin
	insert into BK_DB_pet_show.BK_Endereco values(null, old.id_endereco, old.estado, old.cidade, old.bairro, old.rua, old.numero, 
		old.complemento, old.id_fk_pessoa, "D",current_user());
end$

create trigger Deletando_BK_produto
before delete
on Produto
for each row
begin
	insert into BK_DB_pet_show.BK_Produto values(null, old.id_produto, old.nome, 
     old.quantidade_disponivel, old.preco, old.descricao,
		old.imagens, old.promocao, old.animal, old.classe, "D", current_user());
end$

create trigger Deletando_BK_fornecedor
before delete
on Fornecedor
for each row
begin
	insert into BK_DB_pet_show.BK_Fornecedor values(null, old.id_fk_pessoa, old.CNPJ, "D", current_user());
end$

create trigger Deletando_BK_cliente
before delete
on Cliente
for each row
begin
	insert into BK_DB_pet_show.BK_Cliente values(null, old.id_fk_pessoa, old.CPF, old.data_cadastro, old.data_nascimento,
		old.sexo, "D", current_user());
end$

create trigger Deletando_BK_FP
before delete
on FornecedorProduto
for each row
begin
	insert into BK_DB_pet_show.BK_FornecedorProduto values (null, old.id_fornecedor_produto, old.id_fk_produto, old.id_fk_fornecedor, 
		old.quantidade, "D", current_user());
end$

create trigger Deletando_BK_CP
before delete
on ClienteProduto
for each row
begin
	insert into BK_DB_pet_show.BK_ClienteProduto values (null, old.id_cliente_produto, old.id_fk_produto, old.id_fk_cliente, "D",current_user());
end$

delimiter ;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE ClienteProduto;
TRUNCATE TABLE Produto;
SET FOREIGN_KEY_CHECKS = 1;

insert into Pessoa(nome, email, senha, tipo) values 
('Julia Cristina Souza','juliaSouza@gmail.com', "123456", "Cliente"),
('Felipe Pereira da Silva', 'felipepsilva@gmail.com', "abacaxiverde", "fornecedor"),
('Ana Maria da Cruz Figueredo', 'anacruz@gmail.com', "pãodebatata", "Cliente"),
('Pedro Augusto barboza', 'pedrobarboza@gmail.com', "123", "fornecedor"),
("italo","italo@gmail.com","italo1235", "fornecedor"),
("isa","isa@gmail.com","isa1234", "Cliente"),
("alice","alice1.137.3.14@gmail.com","@Alice", "Cliente");



insert into Telefone(tipo,numero,id_fk_pessoa) values 
('CEL','31983517361',1),
('TEL', '373057040',2),
('COM', '1198674652',3),
('CEL','2615487930',4),
('TEL', '1425386790',5),
('COM', '428648621',6),
('CEL', '9173824650',7);

insert into Endereco(estado,cidade,bairro,rua,numero,complemento,id_fk_pessoa) values 
('MG','belo horizonte','buritis','rua das hortencias',250,'casa',1),
('SP', 'campinas','vale verde','rua jk',550,'bloco 1',2),
('RJ', 'duque de caxias','santa monica','rua conhas',7855,'casa',3),
('RN', 'natal','cajueiro','rua das castanhas',2450,'bloco 4',4),
('RS', 'porto alegre', 'centro historico', 'rua dos andradas', 1020, 'apto 301', 5),
('PR', 'curitiba', 'batel', 'avenida do sol', 850, 'sala 40', 6),
('CE', 'fortaleza', 'aldeota', 'rua dos pinheiros', 1050, 'casa', 7);

insert into Produto(nome, quantidade_disponivel, descricao, preco, imagens, promocao, animal, classe) values 
('Ração quatree lite', 7, 'Ração para gatos com baixo teor de kcal, otima para a saude do seu gato', 120.50, 'https://images.tcdn.com.br/img/img_prod/587393/quatree_life_gatos_ad_3_kg_3421_1_a8ba41cf660d89f133cc6a7a9bedfaf9.jpg', 0, 'gato', 'comida'),
('Ração natural', 18, 'Ração para cachorros com produtos naturais', 249.99, 'https://images.tcdn.com.br/img/img_prod/699275/racao_vitta_natural_frango_e_arroz_para_caes_adultos_15kg_8351_1_78b078f514efdac4ae8318e77da84089.jpg', 12, 'cachorro', 'comida'),
('sache whiskas salmao ', 158, ' o melhor para complementar a dieta do seu felino.', 3.5, 'https://cdn.awsli.com.br/800x800/1226/1226108/produto/139506005/ra-o--mida-whiskas-sach--sabor-salm-o-ao-molho-para-gatos-adultos---85g-3bzipwuh4l.jpg', 2, 'gato', 'comida'),
('Ração para gatos', 17, 'Pacote de ração de 10kg sabor frango para gatos.', 150.99, 'https://m.media-amazon.com/images/I/81m0tS6CjtL._AC_SX569_.jpg', 0, 'gato','comida'),
('Ração para cachorros', 23, 'Pacote de ração de 10kg sabor carne com legumes para cachorro.', 150, 'https://d26lpennugtm8s.cloudfront.net/stores/162/797/products/alpo1-b56646b610faf562d914865694095532-1024-1024.jpg', 15, 'cachorro', 'comida'),
('Ração para jabuti', 15, 'Pacote de ração de 800g para jabuti.', 89.9, 'https://down-br.img.susercontent.com/file/4d006674a5b625b081b45302a74b2e54', 23, 'reptil','comida'),
('Arranhador de Madeira com Brinquedos para Gatos', 59, 'Arranhador de Madeira com esferas balançantes em cordas, penas em aro de metal e bolinhas em espaço reservado, tudo isso para seus gatos.', 457, 'https://mimers.com.br/cdn/shop/files/Grande_7_1000x.png?v=1703249251', 30, 'gato', 'brinquedo'),
('Tunel para gato', 7, 'Brinquedo de tunel em formato de ''T'' com quatro entradas e várias bolinhas dependuradas em seu interior.', 156.65, 'https://salescdn.net/0tu1sZc0z2DO7a57WOzsigVNd9k=/adaptive-fit-in/600x0/prod/store/12895/medias/products/brinquedo-tunel-de-gato-em-t-dobravel-9ad5bca5-bafc-4346-ab9c-95f47be3e34f.webp', 0, 'gato', 'brinquedo'),
('Galinha de brinquedo para cachorro', 88, 'Galinha de plastico de brinquedo para cachorro morder, causando som.', 5.99, 'https://joli.vtexassets.com/arquivos/ids/615082/Brinquedo_Para_Cachorro_Galinha_Etilux_102389902jpg.jpg?v=638026455878700000', 0, 'cachorro', 'brinquedo'),
('Bumerangue para cachorro', 21, 'Bumerangue para jogar e o cachorro trazer de volta como forma de brincadeira.', 3.25, 'https://cdn.awsli.com.br/2500x2500/2740/2740975/produto/315657212/d_605942-mlb73616571904_122023-o-i9ti6pk5ax.jpg', 0, 'cachorro', 'brinquedo'),
('Poleiro para passarinho', 16, 'Poleiro giratorio com várias astes para pássaros.', 35.4, 'https://images.tcdn.com.br/img/img_prod/1149236/brinquedo_para_papagaio_aves_passaros_poleiro_giratorio_97_1_9ef7c9ea59ef6352eb1fc17c07ffdcf2.jpg', 40, 'passaro', 'brinquedo'),
('Poleiro redondo para passarinho', 17, 'Circulo no ar para pássaro pousar.', 18.5, 'https://http2.mlstatic.com/D_NQ_NP_795998-MLB54553087399_032023-O-kit-brinquedos-para-aves-argolas-.webp', 0, 'passaro', 'brinquedo'),
('Rede para lagarto', 18, 'Rede de corda marrom com ventosa para grudar.', 27.3, 'https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/57545ad728ffdeae6345cb0793716038.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp', 10, 'reptil', 'brinquedo'),
('Brinquedo de alimentação de lagarto', 57, 'Ampulheta de plastico com buraco para pegar insetos de dentro.', 16.5, 'https://m.media-amazon.com/images/I/713TpDmJQ+L._AC_UF1000,1000_QL80_.jpg', 0, 'reptil', 'brinquedo'),
('Casa para gato', 233, 'Casa aveludada suspensa em 3 aranhadores com uma rede de veludo em baixo.', 158, 'https://http2.mlstatic.com/D_NQ_NP_2X_897720-MLA96418053498_102025-F.webp', 31, 'gato', 'casa'),
('Cama para cachorro', 51, 'Cama azul com desenhos de patas e ossos e um trvesseiro pequno.', 78.9, 'https://m.media-amazon.com/images/I/61fa9EwnBHL._AC_SX679_.jpg', 0, 'cachorro', 'casa'),
('Casa para pássaros', 31, 'Casa de madeira com buraco esferico e haste de madeira para pouso na parte da frente e espaço retangular dependurado por correntes em baixo da casa também dependurada por correntes.', 105.5, 'https://dw0jruhdg6fis.cloudfront.net/producao/30553005/G/casinha-tratador-para-passaros-passarinhos.webp', 5, 'passaro', 'casa'),
('Casa para répteis', 15, 'Tanque de 45cm X 45cm X 45cm para répteis com vegetação, troncos e terreno.', 1819.14, 'https://m.media-amazon.com/images/I/81azH1i0e2L.jpg', 25, 'reptil', 'casa'),
('Ração para peixes', 28, 'Ração para peixes basic com prebióticos, enzimas digestivas, minerais orgânicos e vitaminas estabilizadas, 20g sem corantes artifíciais.', 22.23, 'https://images.tcdn.com.br/img/img_prod/573283/racao_flocos_para_peixes_de_aquario_alcon_basic_alimento_completo_em_flocos_para_peixe_20g_535839_1_20200828181535.jpg', 5, 'peixe', 'comida'),
('Tunel para peixes', 58, 'Túnel cilindrico com buracos e ventosas para grudar, brinquedo para peixes.', 134.46, 'https://m.media-amazon.com/images/I/714SMGG1AcL.jpg', 50, 'peixe', 'brinquedo'),
('Peixe falso de brinquedo', 568, 'Peixe de plastico em aste para segurar e brincar com peixes.', 17.54, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQeZpRU4VvSm-4J2XtrNerrAV5o5gNCK9fJxFPww3BGod8F--21I_xfaZQpnyFVm4tPeyCFraqYk5Wmed_ItdLZ-C7sDrdMsV1Gv-Linkah7Eh6keE88zkq', 50, 'peixe', 'brinquedo'),
('Aquario para peixes', 258, 'Aquario com plantas, tronco, chão de pedras, luzes e oxigenador de água.', 610, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQHnLLAdpYNu1OeoKRxqmlFerQ8NAsQtjeMVQ5tzzrmpE5XBTpADG_KXaBkIan8-6gIyEB_eVuxJbE4HUzeQuuuFz8Jfzm5WI2OGQUXLrsrOwZoVpxjelLGog', 15, 'peixe', 'casa'),
('Osso para cachorro', 81, 'Osso femur bovino natural para comer e brincar.', 32.42, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQdmGwPAAzP8jnbV19wO1je_tjQMUQxKAAIYX-J9ZuCQbOLCc0gbNR36nzsPuhTi8lH9kgxScVP4R_Abh6WMh9fwnPpElu56D4HUkvLjJEiR-MDnP1L5GmFTus', 0, 'cachorro', 'comida');


insert into Cliente(id_fk_pessoa,CPF,data_cadastro,data_nascimento,sexo) values 
(1, '12345678909', str_to_date('2025-04-30', '%Y-%m-%d'),str_to_date('1998-03-22', '%Y-%m-%d') ,'F'),
(3,'98765432100', str_to_date('2026-02-06', '%Y-%m-%d'),str_to_date('2001-11-05', '%Y-%m-%d'),'I'),
(5, '98767436180',  str_to_date('2022-12-30', '%Y-%m-%d'),  str_to_date('1997-04-30', '%Y-%m-%d'), "M"),
(6, '98765489110',  str_to_date('2020-04-28', '%Y-%m-%d'), str_to_date('1988-07-03', '%Y-%m-%d'), "F"),
(7, '98736432196',  str_to_date('2024-03-15', '%Y-%m-%d'), str_to_date('2011-05-18', '%Y-%m-%d'), "F");


insert into FornecedorProduto(id_fk_produto,id_fk_fornecedor, quantidade ) values 
(2, 1,20),
(4,3,50),
(1,1,15),
(2,3,20),
(3,1,12),
(4,3,50),
(5,1,30),
(6,3,18),
(7,1,25),
(8,3,40),
(9,1,10),
(10,3,22),
(11,1,35),
(12,3,28),
(13,1,16),
(14,3,45),
(15,1,19),
(16,3,27),
(17,1,14),
(18,3,33),
(19,1,21),
(20,3,38),
(21,1,17),
(22,3,26),
(23,1,31),
(1,3,24),
(2,1,13),
(3,3,29),
(4,1,32),
(5,3,11),
(6,1,36),
(7,3,23),
(8,1,41),
(9,3,20);

insert into ClienteProduto(id_fk_produto,id_fk_cliente) values 
(1,2),
(3,4),
(2,5),
(4,6),
(5,7),
(6,2),
(7,4),
(8,5),
(9,6),
(10,7),
(11,2),
(12,4),
(13,5),
(14,6),
(15,7),
(16,2),
(17,4),
(18,5),
(19,6),
(20,7),
(21,2),
(22,4),
(23,5),
(1,6),
(2,7),
(3,2),
(4,4),
(5,5),
(6,6),
(7,7),
(8,2),
(9,4),
(10,5),
(11,6),
(12,7),
(13,2),
(14,4),
(15,5),
(16,6),
(17,7),
(18,2),
(19,4),
(20,5);
